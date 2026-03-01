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

    @Data
    public static class TokenResponse {
        private String accessToken;
        private String tokenType = "Bearer";
        private long expiresIn;
        private UserInfo user;

        public TokenResponse(String accessToken, long expiresIn, UserInfo user) {
            this.accessToken = accessToken;
            this.expiresIn   = expiresIn;
            this.user        = user;
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
