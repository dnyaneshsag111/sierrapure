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

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthDTO.TokenResponse login(AuthDTO.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isActive())
            throw new BadCredentialsException("Account is deactivated. Contact admin.");

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new BadCredentialsException("Invalid email or password");

        String token = jwtService.generateToken(user);
        log.info("User logged in: {} ({})", user.getEmail(), user.getRole());

        return new AuthDTO.TokenResponse(
                token,
                jwtService.getExpirationMs(),
                toUserInfo(user)
        );
    }

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

        // Send welcome email (non-blocking)
        try {
            emailService.sendWelcomeEmail(saved);
        } catch (Exception e) {
            log.warn("Welcome email failed for {}: {}", saved.getEmail(), e.getMessage());
        }

        String token = jwtService.generateToken(saved);
        return new AuthDTO.TokenResponse(token, jwtService.getExpirationMs(), toUserInfo(saved));
    }

    public void changePassword(String userId, AuthDTO.ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            throw new BadCredentialsException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    public List<User> getAllUsers() {
        return userRepository.findByIsActiveTrue();
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

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
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
