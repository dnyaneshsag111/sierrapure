package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.dto.AuthDTO;
import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.User;
import com.mineralwater.sierrapure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 15;

    // ── Login ─────────────────────────────────────────────────────────

    public AuthDTO.TokenResponse login(AuthDTO.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isActive())
            throw new BadCredentialsException("Account is deactivated. Contact admin.");

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new BadCredentialsException("Invalid email or password");

        log.info("User logged in: {} ({})", user.getEmail(), user.getRole());
        return issueTokenPair(user);
    }

    // ── Register ──────────────────────────────────────────────────────

    public AuthDTO.TokenResponse register(AuthDTO.RegisterRequest req, String createdByRole) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());

        // Only ADMIN can create ADMIN or LAB_ANALYST accounts
        String role = req.getRole() != null ? req.getRole().toUpperCase() : "CLIENT";
        if ((role.equals("ADMIN") || role.equals("LAB_ANALYST"))
                && !"ADMIN".equals(createdByRole)) {
            role = "CLIENT";
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .isActive(true)
                .isEmailVerified(false)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: {} role={}", saved.getEmail(), saved.getRole());

        try {
            emailService.sendWelcomeEmail(saved);
        } catch (Exception e) {
            log.warn("Welcome email failed for {}: {}", saved.getEmail(), e.getMessage());
        }

        return issueTokenPair(saved);
    }

    // ── Refresh Token ─────────────────────────────────────────────────

    /**
     * Validates the incoming refresh token (by comparing its hash to what's stored),
     * rotates it (issues a new pair), and returns the new access + refresh token.
     */
    public AuthDTO.TokenResponse refreshAccessToken(AuthDTO.RefreshRequest req) {
        String incomingHash = jwtService.hashToken(req.getRefreshToken());

        User user = userRepository.findByRefreshToken(incomingHash)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired refresh token"));

        if (!user.isActive())
            throw new BadCredentialsException("Account is deactivated");

        log.info("Refresh token rotated for: {}", user.getEmail());
        return issueTokenPair(user);   // rotation: old token replaced by new one
    }

    // ── Logout (invalidate refresh token) ─────────────────────────────

    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(u -> {
            u.setRefreshToken(null);
            userRepository.save(u);
            log.info("Refresh token cleared for: {}", email);
        });
    }

    // ── Forgot Password ───────────────────────────────────────────────

    /**
     * Generates a 6-digit OTP, hashes & stores it, and emails it to the user.
     * Always returns success (no user-enumeration).
     */
    public void forgotPassword(AuthDTO.ForgotPasswordRequest req) {
        userRepository.findByEmail(req.getEmail()).ifPresent(user -> {
            if (!user.isActive()) return;

            String otp = generateOtp();
            user.setPasswordResetOtp(passwordEncoder.encode(otp));   // store hashed
            user.setPasswordResetOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            userRepository.save(user);
            log.info("Password reset OTP generated for: {}", user.getEmail());

            try {
                emailService.sendPasswordResetOtp(user, otp);
            } catch (Exception e) {
                log.error("Failed to send OTP email to {}: {}", user.getEmail(), e.getMessage());
            }
        });
    }

    // ── Reset Password ────────────────────────────────────────────────

    public void resetPassword(AuthDTO.ResetPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or OTP"));

        if (user.getPasswordResetOtp() == null || user.getPasswordResetOtpExpiry() == null)
            throw new BadCredentialsException("No active password reset request found");

        if (LocalDateTime.now().isAfter(user.getPasswordResetOtpExpiry()))
            throw new BadCredentialsException("OTP has expired. Please request a new one");

        if (!passwordEncoder.matches(req.getOtp(), user.getPasswordResetOtp()))
            throw new BadCredentialsException("Invalid OTP");

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setPasswordResetOtp(null);
        user.setPasswordResetOtpExpiry(null);
        user.setRefreshToken(null);   // invalidate all sessions on password reset
        userRepository.save(user);
        log.info("Password reset successful for: {}", user.getEmail());
    }

    // ── Change Password (authenticated) ──────────────────────────────

    public void changePassword(String userId, AuthDTO.ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            throw new BadCredentialsException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setRefreshToken(null);   // force re-login after password change
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    // ── User management ───────────────────────────────────────────────

    public List<User> getAllUsers() {
        return userRepository.findAll();   // return ALL users including inactive
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRoleAndIsActiveTrue(role.toUpperCase());
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User toggleActive(String id) {
        User user = getById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    /** ADMIN — update user name, phone, role, active status, optionally reset password */
    public User updateUser(String id, AuthDTO.UpdateUserRequest req) {
        User user = getById(id);
        if (req.getName()     != null) user.setName(req.getName());
        if (req.getPhone()    != null) user.setPhone(req.getPhone());
        if (req.getRole()     != null) user.setRole(req.getRole().toUpperCase());
        if (req.getIsActive() != null) user.setActive(req.getIsActive());
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
            user.setRefreshToken(null);   // invalidate all sessions
            log.info("Password reset by admin for user: {}", user.getEmail());
        }
        User saved = userRepository.save(user);
        log.info("User updated by admin: {} id={}", saved.getEmail(), id);
        return saved;
    }

    /** ADMIN — hard delete a user */
    public void deleteUser(String id) {
        User user = getById(id);
        userRepository.deleteById(id);
        log.info("User deleted by admin: {} id={}", user.getEmail(), id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    // ── Helpers ───────────────────────────────────────────────────────

    /** Issue access + refresh token pair, rotate refresh token in DB */
    private AuthDTO.TokenResponse issueTokenPair(User user) {
        String accessToken   = jwtService.generateToken(user);
        String refreshToken  = jwtService.generateRefreshToken();      // plain token sent to client
        String hashedRefresh = jwtService.hashToken(refreshToken);     // hash stored in DB

        user.setRefreshToken(hashedRefresh);
        userRepository.save(user);

        return new AuthDTO.TokenResponse(
                accessToken,
                refreshToken,
                jwtService.getExpirationMs(),
                toUserInfo(user)
        );
    }

    private String generateOtp() {
        SecureRandom rng = new SecureRandom();
        int otp = 100_000 + rng.nextInt(900_000);  // 6-digit
        return String.valueOf(otp);
    }

    private AuthDTO.UserInfo toUserInfo(User u) {
        return AuthDTO.UserInfo.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .isActive(u.isActive())
                .build();
    }
}
