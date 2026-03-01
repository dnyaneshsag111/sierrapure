# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build the React frontend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/ui

# Cache npm install layer
COPY ui/package*.json ./
RUN npm ci --silent

# Build production bundle
COPY ui/ ./
RUN npm run build
# Output: /app/ui/dist

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Build the Spring Boot backend (fat JAR)
# ─────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Cache Maven dependencies separately
COPY pom.xml ./
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src/ ./src/
RUN mvn clean package -DskipTests -q

# Output: /app/target/sierrapure-0.0.1-SNAPSHOT.jar

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Runtime image (JRE only — much smaller than JDK)
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

LABEL maintainer="Sierra Pure <support@sierrapure.in>"
LABEL org.opencontainers.image.title="Sierra Pure API"
LABEL org.opencontainers.image.description="Spring Boot backend + React frontend for Sierra Pure"
LABEL org.opencontainers.image.version="1.0.0"

# Create non-root user for security
RUN addgroup -S sierrapure && adduser -S sierrapure -G sierrapure

WORKDIR /app

# Copy fat JAR from backend build stage
COPY --from=backend-build /app/target/sierrapure-0.0.1-SNAPSHOT.jar app.jar

# Copy built frontend into Spring Boot's static resources directory
# Spring Boot will serve these automatically at /
COPY --from=frontend-build /app/ui/dist/ /app/static/

# Create uploads directory (bind-mount in production)
RUN mkdir -p /app/uploads/bottles /app/uploads/clients /app/uploads/logo /app/uploads/hero \
    && chown -R sierrapure:sierrapure /app

USER sierrapure

EXPOSE 8080

# JVM tuning: container-aware heap, no JIT pre-warming for faster startup
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
