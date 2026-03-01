# Sierra Pure — Project Status (as of March 1, 2026)

> **Stack:** Spring Boot 3 · MongoDB · React 19 · Vite · MUI v7 · React Query v5

---

## ✅ Completed Items

### 🔙 Backend — Spring Boot

#### Core Architecture
- [x] Spring Boot 3 project setup with Maven (`sierrapure-0.0.1-SNAPSHOT.jar`)
- [x] MongoDB integration (`spring.data.mongodb.uri`)
- [x] Application configuration (`application.properties`) — JWT, email, upload paths, CORS, Thymeleaf
- [x] Global exception handler (`GlobalExceptionHandler.java`)
- [x] `ResourceNotFoundException` custom exception
- [x] Unified `ApiResponse<T>` wrapper DTO
- [x] Response compression enabled
- [x] Multipart file upload config (up to 20 MB per file)

#### Security & Auth
- [x] JWT generation & validation (`JwtService.java`) — HS512, configurable secret & expiry
- [x] JWT auth filter (`JwtAuthFilter.java`) — Bearer token extraction from request headers
- [x] Spring Security config (`SecurityConfig.java`) — CORS, stateless session, role-based route protection
- [x] User model (`User.java`) with roles: `ADMIN`, `LAB_ANALYST`, `CLIENT`
- [x] `UserService.java` — user registration, password encoding, role management
- [x] `AuthController.java` — `/api/v1/auth/login`, `/api/v1/auth/register`
- [x] Auth DTOs (`AuthDTO.java`)

#### Data Models & Repositories
- [x] `Product.java` — name, size, features, imageUrl, segments
- [x] `LabReport.java` — batchNumber, manufacturingDate, parameters, overallResult, isPublished
- [x] `TestParameter.java` — embedded sub-document (name, value, unit, permissibleLimit, method, status)
- [x] `Client.java` — name, segment, logoUrl, testimonial, location
- [x] `ContactRequest.java` — enquiry form model with status tracking
- [x] `ImageAsset.java` — category (BOTTLE, SIERRA_LOGO, HERO_BOTTLE, CLIENT_LOGO), label, publicUrl
- [x] All MongoDB repositories (Product, LabReport, Client, ContactRequest, ImageAsset, User)

#### Services
- [x] `ProductService.java` — CRUD, image upload per product
- [x] `LabReportService.java` — create/update/delete, publish toggle, paginated listing, search by batch/date
- [x] `ClientService.java` — CRUD with logo upload
- [x] `ContactService.java` — submit enquiry, status update (new → contacted → closed)
- [x] `ImageStorageService.java` — local disk storage under `/uploads/` with UUID filenames
- [x] `EmailService.java` — async email via SMTP; enquiry confirmation to customer + rich admin notification email (red urgency banner, full details table, Reply-To set to customer email, "View in Admin Panel" + "Reply to Customer" CTA buttons)
- [x] `PDFService.java` — Thymeleaf HTML → PDF (Flying Saucer / iText)
- [x] `QRCodeService.java` — ZXing QR code PNG generation linking to lab report page
- [x] `JwtService.java` — token generation, email/role extraction, validation

#### Controllers (REST API — `/api/v1/`)
- [x] `AuthController` — login, register
- [x] `ProductController` — GET list/by-id, PUT update, POST image upload
- [x] `LabReportController` — GET (paginated, search, by-id, by-batch), POST, PUT, DELETE, publish toggle, PDF download, QR code
- [x] `ClientController` — GET list/by-segment, POST, PUT, DELETE, logo upload
- [x] `ContactController` — POST submit, GET list (admin), PATCH status update
- [x] `ImageController` — GET by category, POST upload, DELETE
- [x] `QRCodeController` — GET QR PNG by batch number

#### Configuration & Seeding
- [x] `CorsConfig.java` — allows frontend origin (`http://localhost:5173`)
- [x] `MongoConfig.java`
- [x] `DataSeeder.java` — seeds default users (admin, lab analyst, client), sample products (200ml, 500ml, 1000ml), sample lab reports with full parameter sets, sample clients

#### PDF Template
- [x] `lab-report-pdf.html` — Thymeleaf A4 template with:
  - Sierra Pure header + gold accent line
  - BIS / FSSAI / NABL / ISO certification badges
  - Batch info table (batch no., date, bottle size, lab name, tester)
  - Parameter results table (PASS/FAIL per parameter)
  - Overall result banner
  - QR code section + footer

---

### 🖥️ Frontend — React + Vite

#### Project Setup
- [x] Vite + React 19 project (`ui/`)
- [x] MUI v7 + Emotion theming (`theme.js`, `globals.css`)
- [x] React Router v7 with lazy-loaded routes
- [x] React Query v5 with global `QueryClient`
- [x] `react-helmet-async` for SEO meta tags
- [x] `react-hot-toast` for notifications
- [x] Axios instance (`api.js`) with `/api/v1` base URL and response interceptor
- [x] Framer Motion animations throughout
- [x] Swiper, dayjs, react-qr-code, jspdf, react-countup installed

#### Contexts & Auth
- [x] `AuthContext.jsx` — login/logout, token & user persistence in `localStorage`, role helpers (`isAdmin`, `isLabAnalyst`, `isClient`)
- [x] `AppContext.jsx`
- [x] `ProtectedRoute.jsx` — role-based route guarding

#### Common Components
- [x] `Navbar.jsx` — sticky, scroll-aware, mobile drawer, logo from upload or SVG fallback, auth-aware (admin/lab analyst links)
- [x] `Footer.jsx`
- [x] `ScrollToTop.jsx`
- [x] `PageLoader.jsx`
- [x] `ErrorBoundary.jsx`

#### Public Pages
- [x] **Home** (`Home.jsx`) — Hero, Stats, Product Highlights, Why Choose Us, Latest Lab Report, Client Segments, Customization CTA, WhatsApp CTA
- [x] **About** (`About.jsx`) — Hero, Mission/Vision, Timeline (2014–2026), Certifications (BIS, FSSAI, NABL, ISO)
- [x] **Products** (`Products.jsx`) — filterable product grid (size & segment filters), product cards with image
- [x] **Clients** (`Clients.jsx`) — tabbed by segment, client cards with logo/avatar, testimonial
- [x] **Customization** (`Customization.jsx`) — Hero, Who We Serve segments, 5-step process stepper, CTA
- [x] **Lab Reports** (`LabReports.jsx`) — paginated list, search by batch/date, filter by result (PASS/FAIL), PDF download
- [x] **Lab Report Detail** (`LabReportDetail.jsx`) — full parameter table, PASS/FAIL badges, QR code display, share, PDF download
- [x] **Contact** (`Contact.jsx`) — enquiry form (name, email, phone, company, segment, bottle sizes, custom label, message), validation, API submission
- [x] **Login** (`Login.jsx`) — email/password form, role-based redirect after login

#### Home Page Sub-components
- [x] `HeroSection.jsx`
- [x] `StatsSection.jsx` — animated counters (react-countup)
- [x] `ProductHighlights.jsx`
- [x] `WhyChooseUs.jsx`
- [x] `LatestLabReport.jsx`
- [x] `ClientSegments.jsx`

#### Lab & Product Components
- [x] `ReportCard.jsx`
- [x] `ReportStatusBadge.jsx`
- [x] `ParameterRow.jsx`
- [x] `ProductCard.jsx`

#### Admin Panel (`/admin`)
- [x] `AdminLayout.jsx` — sidebar navigation, role-aware menu
- [x] `AdminDashboard.jsx` — stat cards (reports, clients, products, enquiries, images)
- [x] `AdminReports.jsx` — table, create/edit dialog with full parameter editor, publish toggle, PDF download
- [x] `AdminProducts.jsx` — product list, edit dialog, image upload per product
- [x] `AdminClients.jsx` — client list, add/edit dialog, logo upload
- [x] `AdminImages.jsx` — tabbed by category (Bottle, Hero Bottle, Sierra Logo, Client Logo), drag-and-drop upload, delete
- [x] `AdminEnquiries.jsx` — table with expandable row details, status update dropdown
- [x] `AdminUsers.jsx` — user list, add user dialog (name, email, password, role), enable/disable toggle

#### Services & Hooks (Frontend)
- [x] `api.js` — Axios instance
- [x] `labReportService.js` — getAll, getById, getByBatch, downloadPDF
- [x] `productService.js`
- [x] `clientService.js`
- [x] `contactService.js`
- [x] `imageService.js`
- [x] `useLabReports.js`
- [x] `useProducts.js`
- [x] `useClients.js`
- [x] `useImageAssets.js` — fetches uploaded images by category; `byLabel` map + `first` URL (used for logo in Navbar)
- [x] `useImageUpload.js`

#### Utilities
- [x] `constants.js` — SEGMENTS, BOTTLE_SIZES, BOTTLE_COLORS, REPORT_STATUS, ENQUIRY_STATUS
- [x] `formatDate.js`

#### Static Assets
- [x] `sierra-logo.svg` — hand-crafted SVG logo (mountain polygons + water wave + SIERRA PURE text + gold underline) — used as **fallback** in Navbar when no logo is uploaded via admin
- [x] `bottle-200ml.svg`, `bottle-500ml.svg`, `bottle-1000ml.svg`
- [x] `facility.svg`, `hero-bg.svg`, `Sierra.svg`, `sierra-hero-poster.svg`

---

## ❌ Remaining / TODO Items

### 🔙 Backend

- [x] **Refresh Token** — `/auth/refresh` endpoint; UUID-based refresh token, SHA-256 hashed in MongoDB, 30-day expiry, rotation on every use; `/auth/logout` invalidates token server-side
- [x] **Password Reset** — `/auth/forgot-password` (sends 6-digit OTP via email, 15-min expiry) + `/auth/reset-password` (verifies OTP, resets password, clears all sessions); OTP stored bcrypt-hashed in User document
- [x] **Email Test Mode flag** — `app.mail.test-mode=${MAIL_TEST_MODE:false}` added to `application.properties`; `EmailService` reads the flag: when `true` skips SMTP and prints a full readable email preview to the console log; when `false` sends via `JavaMailSender` (real SMTP); `JavaMailSender` injected as `@Autowired(required=false)` so the app starts even with no SMTP config, with a clear `WARN` log instead of a silent failure
- [ ] **Cloudinary integration** — `cloudinary.*` properties exist but are commented as "currently unused"; `ImageStorageService` only writes to local `/uploads/` disk; cloud storage not wired up
- [ ] **Hero/uploads directory config** — `app.upload.hero-dir` missing from `application.properties` (only bottles, clients, logo configured)
- [ ] **Input validation** — no `@Valid` / `@NotBlank` bean validation on request DTOs; all validation is manual
- [x] **Rate limiting** — `RateLimitFilter.java` (Bucket4j, per-IP, in-memory token bucket): login 10/min, register 5/min, forgot-password 3/15min, reset-password 5/15min, contact 3/5min; returns HTTP 429 with JSON body; proxy-aware (`X-Forwarded-For`); all limits configurable via `application.properties`
- [x] **Swagger / OpenAPI docs** — SpringDoc 2.x; `OpenApiConfig.java` with JWT Bearer auth scheme, server info, rate-limit table in description; `@Tag` on all 7 controllers; Swagger UI at `http://localhost:8080/swagger-ui.html`; OpenAPI JSON at `/v3/api-docs`
- [x] **Docker / deployment config** — `Dockerfile` (3-stage: Node frontend build → Maven backend build → JRE-only runtime, non-root user, `eclipse-temurin:21-jre-alpine`); `docker-compose.yml` (MongoDB 7, app, Mongo Express on `--profile dev`; named volumes for data + uploads; healthchecks); `.env.example`; `.dockerignore`
- [ ] **API pagination** — Lab Reports have pagination; Products and Clients do not
- [ ] **Unit & integration tests** — `test/` directory exists but no test classes written
- [ ] **Actuator / Health endpoint** — no Spring Boot Actuator configured for health checks

### 🖥️ Frontend

- [ ] **Customization page components folder** — `ui/src/components/customization/` is **empty**; customization sub-components (if any) are inlined in the page
- [ ] **QR code scanner / public batch lookup** — no standalone `/scan` or `/qr/:batch` public route; users depend on the QR pointing directly to `/lab-reports/batch/:batchNumber`
- [ ] **404 / Not Found page** — no `NotFound.jsx` page; unmatched routes have no fallback UI
- [ ] **Admin password change** — no profile/settings page for admins to change their own password
- [x] **Forgot password UI** — `ForgotPassword.jsx` with 3-step flow (email → OTP → new password); "Forgot password?" link added to Login page; route `/forgot-password` added to App.jsx
- [ ] **Pagination in Admin** — AdminReports has table but no pagination controls for large datasets; AdminClients / AdminEnquiries also lack pagination
- [ ] **Optimistic UI / loading states in Admin dialogs** — some mutate calls lack granular loading indicators
- [ ] **Image compression before upload** — images uploaded raw; no client-side resize/compress before sending
- [ ] **SEO sitemap / robots.txt** — no `sitemap.xml` or `robots.txt` in `public/`
- [ ] **PWA / offline support** — no service worker or manifest
- [ ] **Internationalization (i18n)** — all text is English hardcoded; no i18n setup
- [ ] **Dark mode** — MUI theme has no dark variant; `globals.css` only has light-mode CSS vars
- [ ] **About page facility image** — `facility.svg` exists in assets but is not used in `About.jsx`
- [ ] **Environment variable config for prod** — `.env.production` not set up; `VITE_API_BASE_URL` not used (base URL is hardcoded as `/api/v1`)

### 🖼️ Logo — How It Works

| Source | File | When Used |
|--------|------|-----------|
| **Fallback SVG** (always present) | `ui/src/assets/images/sierra-logo.svg` | Shown when no logo has been uploaded via Admin |
| **Uploaded logo** (dynamic) | `uploads/logo/<uuid>.png` served at `/api/v1/images/serve/...` | Shown when admin uploads a logo under **Admin → Images → Sierra Pure Logo** |

**To create/replace the SVG logo:**
1. Design your logo in **Figma**, **Inkscape**, or **Adobe Illustrator**
2. Export as SVG (`File → Export → SVG`)
3. Replace the content of `ui/src/assets/images/sierra-logo.svg`  
   — OR — upload a PNG/SVG via **Admin Panel → Images → Sierra Pure Logo** (the `useImageAssets('SIERRA_LOGO')` hook will pick it up automatically in Navbar)

---

## 📁 Key File Reference

| Purpose | File |
|---------|------|
| Site Logo (SVG fallback) | `ui/src/assets/images/sierra-logo.svg` |
| Logo in Navbar | `ui/src/components/common/Navbar.jsx` (line ~38) |
| Logo upload (admin) | `ui/src/pages/admin/AdminImages.jsx` → category `SIERRA_LOGO` |
| JWT logic | `src/main/java/.../service/JwtService.java` |
| PDF template | `src/main/resources/templates/lab-report-pdf.html` |
| DB seed data | `src/main/java/.../config/DataSeeder.java` |
| App config | `src/main/resources/application.properties` |
| API base URL | `ui/src/services/api.js` |
| Route definitions | `ui/src/App.jsx` |
| Shared constants | `ui/src/utils/constants.js` |

---

*Last updated: March 1, 2026*
