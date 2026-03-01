package com.mineralwater.sierrapure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * SpringDoc / OpenAPI 3 configuration.
 *
 * Swagger UI is available at:
 *   http://localhost:8080/swagger-ui.html  (redirects to /swagger-ui/index.html)
 *
 * Raw OpenAPI JSON:
 *   http://localhost:8080/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Value("${app.base.url:http://localhost:8080}")
    private String serverUrl;

    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI sierraPureOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url(serverUrl).description("Current server"),
                        new Server().url("http://localhost:8080").description("Local development")
                ))
                // Global security: every endpoint that requires auth shows a lock icon
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME, bearerScheme())
                );
    }

    private Info apiInfo() {
        return new Info()
                .title("Sierra Pure API")
                .version("1.0.0")
                .description("""
                        REST API for Sierra Pure — Premium Mineral Water Bottle Company.

                        **Authentication:** Most write endpoints require a Bearer JWT token.
                        Obtain a token via `POST /api/v1/auth/login`, then click **Authorize** and paste it.

                        **Rate limits (per IP):**
                        | Endpoint | Limit |
                        |---|---|
                        | POST /auth/login | 10 req / 1 min |
                        | POST /auth/register | 5 req / 1 min |
                        | POST /auth/forgot-password | 3 req / 15 min |
                        | POST /auth/reset-password | 5 req / 15 min |
                        | POST /contact | 3 req / 5 min |
                        """)
                .contact(new Contact()
                        .name("Sierra Pure")
                        .email("support@sierrapure.in")
                        .url("https://sierrapure.in"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://sierrapure.in"));
    }

    private SecurityScheme bearerScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Paste your JWT access token here (without the 'Bearer ' prefix).");
    }
}
