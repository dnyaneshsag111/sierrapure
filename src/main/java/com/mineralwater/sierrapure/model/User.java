package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * User roles:
 *  ADMIN       — full access to all admin panel features
 *  LAB_ANALYST — can create/edit/publish lab reports only
 *  CLIENT      — read-only access, can submit enquiries
 */
@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;           // BCrypt hashed

    private String name;

    private String phone;

    @Indexed
    private String role;               // ADMIN | LAB_ANALYST | CLIENT

    private boolean isActive;

    private boolean isEmailVerified;

    private String refreshToken;       // stored for token rotation (future)

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
