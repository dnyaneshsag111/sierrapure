package com.mineralwater.sierrapure.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;
    private final CorsConfig corsConfig;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Swagger UI & OpenAPI spec (dev tool — disable in prod if needed) ──
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/v3/api-docs"
                ).permitAll()

                // ── Public GET endpoints ───────────────────────────────
                .requestMatchers(HttpMethod.GET,
                        "/api/v1/products/**",
                        "/api/v1/lab-reports/**",
                        "/api/v1/clients/**",
                        "/api/v1/images/**",
                        "/api/v1/qr/**"
                ).permitAll()

                // ── Public POST (contact form, auth) ──────────────────
                .requestMatchers(HttpMethod.POST,
                        "/api/v1/contact",
                        "/api/v1/auth/login",
                        "/api/v1/auth/register",
                        "/api/v1/auth/refresh",
                        "/api/v1/auth/logout",
                        "/api/v1/auth/forgot-password",
                        "/api/v1/auth/reset-password"
                ).permitAll()

                // ── Lab Analyst: create/edit lab reports ──────────────
                .requestMatchers(HttpMethod.POST, "/api/v1/lab-reports/**")
                    .hasAnyRole("ADMIN", "LAB_ANALYST")
                .requestMatchers(HttpMethod.PUT, "/api/v1/lab-reports/**")
                    .hasAnyRole("ADMIN", "LAB_ANALYST")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/lab-reports/**")
                    .hasAnyRole("ADMIN", "LAB_ANALYST")

                // ── Admin only endpoints ───────────────────────────────
                .requestMatchers("/api/v1/auth/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/v1/clients/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/v1/clients/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/clients/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/v1/images/**").hasAnyRole("ADMIN", "LAB_ANALYST")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/images/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/api/v1/contact/**").hasAnyRole("ADMIN", "LAB_ANALYST")
                .requestMatchers(HttpMethod.PATCH,  "/api/v1/contact/**").hasAnyRole("ADMIN", "LAB_ANALYST")

                // ── Any other request needs authentication ─────────────
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                    response.setStatus(401);
                    response.getWriter().write("{\"success\":false,\"message\":\"Authentication required\"}");
                })
            )
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
