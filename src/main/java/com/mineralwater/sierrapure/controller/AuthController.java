package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.AuthDTO;
import com.mineralwater.sierrapure.model.User;
import com.mineralwater.sierrapure.service.UserService;
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
public class AuthController {

    private final UserService userService;

    /** Public — login with email + password, returns JWT */
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

    /** Change own password */
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

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("CLIENT");
    }
}
