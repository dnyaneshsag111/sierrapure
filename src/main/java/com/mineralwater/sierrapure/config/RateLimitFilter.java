package com.mineralwater.sierrapure.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servlet filter that enforces per-IP rate limits on sensitive public endpoints.
 *
 * <p>Rate-limited paths (configurable via application.properties):
 * <ul>
 *   <li>POST /api/v1/auth/login         — 10 req / 1 min  (brute-force protection)</li>
 *   <li>POST /api/v1/auth/register      — 5  req / 1 min</li>
 *   <li>POST /api/v1/auth/forgot-password — 3 req / 15 min (OTP abuse prevention)</li>
 *   <li>POST /api/v1/auth/reset-password  — 5 req / 15 min</li>
 *   <li>POST /api/v1/contact            — 3  req / 5 min  (spam protection)</li>
 * </ul>
 *
 * <p>Each IP gets its own {@link Bucket} per endpoint family.
 * Buckets are stored in {@link ConcurrentHashMap}s (in-memory).
 * Returns HTTP 429 with a JSON body when the limit is exceeded.
 */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    // ── Configurable limits (override via application.properties) ─────────────

    @Value("${app.rate-limit.login.capacity:10}")
    private int loginCapacity;

    @Value("${app.rate-limit.login.refill-minutes:1}")
    private int loginRefillMinutes;

    @Value("${app.rate-limit.register.capacity:5}")
    private int registerCapacity;

    @Value("${app.rate-limit.register.refill-minutes:1}")
    private int registerRefillMinutes;

    @Value("${app.rate-limit.otp.capacity:3}")
    private int otpCapacity;

    @Value("${app.rate-limit.otp.refill-minutes:15}")
    private int otpRefillMinutes;

    @Value("${app.rate-limit.contact.capacity:3}")
    private int contactCapacity;

    @Value("${app.rate-limit.contact.refill-minutes:5}")
    private int contactRefillMinutes;

    // ── Per-IP bucket maps — one map per endpoint family ─────────────────────

    private final Map<String, Bucket> loginBuckets          = new ConcurrentHashMap<>();
    private final Map<String, Bucket> registerBuckets       = new ConcurrentHashMap<>();
    private final Map<String, Bucket> forgotPasswordBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> resetPasswordBuckets  = new ConcurrentHashMap<>();
    private final Map<String, Bucket> contactBuckets        = new ConcurrentHashMap<>();

    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String path   = request.getRequestURI();

        // Only rate-limit POST requests on specific paths
        if (!"POST".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        String ip     = resolveClientIp(request);
        Bucket bucket = resolveBucket(ip, path);

        if (bucket == null) {
            // Path is not rate-limited
            chain.doFilter(request, response);
            return;
        }

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            log.warn("[RATE-LIMIT] Blocked {} {} from IP={}", method, path, ip);
            sendTooManyRequests(response, path);
        }
    }

    // ── Resolve which bucket to use for a given IP + path ────────────────────

    private Bucket resolveBucket(String ip, String path) {
        if (path.equals("/api/v1/auth/login")) {
            return loginBuckets.computeIfAbsent(ip, k ->
                    newBucket(loginCapacity, loginRefillMinutes));
        }
        if (path.equals("/api/v1/auth/register")) {
            return registerBuckets.computeIfAbsent(ip, k ->
                    newBucket(registerCapacity, registerRefillMinutes));
        }
        if (path.equals("/api/v1/auth/forgot-password")) {
            return forgotPasswordBuckets.computeIfAbsent(ip, k ->
                    newBucket(otpCapacity, otpRefillMinutes));
        }
        if (path.equals("/api/v1/auth/reset-password")) {
            return resetPasswordBuckets.computeIfAbsent(ip, k ->
                    newBucket(otpCapacity, otpRefillMinutes));
        }
        if (path.equals("/api/v1/contact")) {
            return contactBuckets.computeIfAbsent(ip, k ->
                    newBucket(contactCapacity, contactRefillMinutes));
        }
        return null;
    }

    // ── Bucket factory — greedy refill: all tokens restored every `minutes` ──

    private Bucket newBucket(int capacity, int refillMinutes) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(capacity, Duration.ofMinutes(refillMinutes))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    // ── Extract real client IP (proxy-aware) ─────────────────────────────────

    private String resolveClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    // ── 429 response ──────────────────────────────────────────────────────────

    private void sendTooManyRequests(HttpServletResponse response, String path) throws IOException {
        String message = getTooManyRequestsMessage(path);
        response.setStatus(429);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(
                "{\"success\":false,\"message\":\"" + message + "\"}"
        );
    }

    private String getTooManyRequestsMessage(String path) {
        if (path.contains("login"))            return "Too many login attempts. Please try again in a minute.";
        if (path.contains("register"))         return "Too many registration attempts. Please try again in a minute.";
        if (path.contains("forgot-password"))  return "Too many OTP requests. Please wait 15 minutes before trying again.";
        if (path.contains("reset-password"))   return "Too many reset attempts. Please wait 15 minutes before trying again.";
        if (path.contains("contact"))          return "Too many enquiry submissions. Please wait a few minutes before trying again.";
        return "Too many requests. Please slow down.";
    }

    // ── Only intercept relevant API paths (skip static resources) ────────────

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/api/v1/");
    }
}
