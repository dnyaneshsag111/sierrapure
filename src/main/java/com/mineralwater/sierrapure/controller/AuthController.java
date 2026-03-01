package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.AuthDTO;
import com.mineralwater.sierrapure.model.User;
import com.mineralwater.sierrapure.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, register, token refresh, password reset and user management")
public class AuthController {

    private final UserService userService;

    /** Public — login with email + password, returns access + refresh token */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTO.TokenResponse>> login(
            @Valid @RequestBody AuthDTO.LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.login(req), "Login successful"));
    }

    /**
     * Register a new user.
     * - Anyone can self-register as CLIENT
     * - Only ADMIN can register ADMIN or LAB_ANALYST
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDTO.TokenResponse>> register(
            @Valid @RequestBody AuthDTO.RegisterRequest req,
            Authentication auth) {
        String callerRole = (auth != null) ? extractRole(auth) : "PUBLIC";
        return ResponseEntity.ok(ApiResponse.success(
                userService.register(req, callerRole), "Registration successful"));
    }

    /**
     * Public — exchange a valid refresh token for a new access + refresh token pair.
     * Old refresh token is invalidated (rotation).
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthDTO.TokenResponse>> refresh(
            @Valid @RequestBody AuthDTO.RefreshRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.refreshAccessToken(req), "Token refreshed"));
    }

    /**
     * Authenticated — logout: invalidates the stored refresh token so it cannot be reused.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(Authentication auth) {
        if (auth != null) userService.logout(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Logged out", "Logged out successfully"));
    }

    /**
     * Public — request a 6-digit OTP to reset password.
     * Always returns 200 (no user enumeration).
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody AuthDTO.ForgotPasswordRequest req) {
        userService.forgotPassword(req);
        return ResponseEntity.ok(ApiResponse.success(
                "If that email is registered, an OTP has been sent.",
                "OTP sent"));
    }

    /**
     * Public — reset password using the OTP received via email.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody AuthDTO.ResetPasswordRequest req) {
        userService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.success(
                "Password reset successfully. Please log in with your new password.",
                "Password reset successful"));
    }

    /** Change own password (authenticated) */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody AuthDTO.ChangePasswordRequest req,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        userService.changePassword(user.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Password changed", "Password updated successfully"));
    }

    /** Who am I */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthDTO.UserInfo>> me(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        AuthDTO.UserInfo info = AuthDTO.UserInfo.builder()
                .id(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole())
                .isActive(user.isActive()).build();
        return ResponseEntity.ok(ApiResponse.success(info, "User info fetched"));
    }

    /** ADMIN — list all users */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(
            @RequestParam(required = false) String role) {
        List<User> users = (role != null)
                ? userService.getUsersByRole(role)
                : userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "Users fetched"));
    }

    /** ADMIN — toggle user active/inactive */
    @PatchMapping("/users/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleUser(@PathVariable String id) {
        User user = userService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("id", user.getId(), "isActive", user.isActive()),
                user.isActive() ? "User activated" : "User deactivated"));
    }

    /** ADMIN — update user (name, phone, role, active, optionally reset password) */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody AuthDTO.UpdateUserRequest req) {
        User updated = userService.updateUser(id, req);
        return ResponseEntity.ok(ApiResponse.success(updated, "User updated"));
    }

    /** ADMIN — delete a user permanently */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", "User deleted successfully"));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("CLIENT");
    }
}


