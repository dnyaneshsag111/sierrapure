package com.mineralwater.sierrapure.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
        private String phone;
        /** ADMIN | LAB_ANALYST | CLIENT — only ADMIN can create ADMIN/LAB_ANALYST */
        private String role = "CLIENT";
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;
        @NotBlank @Size(min = 8)
        private String newPassword;
    }

    /** Used by PUT /auth/users/{id} — admin editing a user */
    @Data
    public static class UpdateUserRequest {
        private String name;
        private String phone;
        private String role;
        private Boolean isActive;
        /** Optional — if provided, resets the user's password */
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String newPassword;
    }

    /** Used by /auth/refresh */
    @Data
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }

    /** Used by /auth/forgot-password */
    @Data
    public static class ForgotPasswordRequest {
        @Email @NotBlank
        private String email;
    }

    /** Used by /auth/reset-password */
    @Data
    public static class ResetPasswordRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String otp;
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
        private String newPassword;
    }

    @Data
    public static class TokenResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private long expiresIn;
        private UserInfo user;

        public TokenResponse(String accessToken, String refreshToken, long expiresIn, UserInfo user) {
            this.accessToken  = accessToken;
            this.refreshToken = refreshToken;
            this.expiresIn    = expiresIn;
            this.user         = user;
        }
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String name;
        private String email;
        private String role;
        private boolean isActive;
    }
}


