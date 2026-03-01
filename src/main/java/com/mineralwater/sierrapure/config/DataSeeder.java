package com.mineralwater.sierrapure.config;

import com.mineralwater.sierrapure.model.Client;
import com.mineralwater.sierrapure.model.LabReport;
import com.mineralwater.sierrapure.model.Product;
import com.mineralwater.sierrapure.model.TestParameter;
import com.mineralwater.sierrapure.model.User;
import com.mineralwater.sierrapure.repository.ClientRepository;
import com.mineralwater.sierrapure.repository.LabReportRepository;
import com.mineralwater.sierrapure.repository.ProductRepository;
import com.mineralwater.sierrapure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final LabReportRepository labReportRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedLabReports();
        seedClients();
        seedProducts();
    }

    // ── Default Users ─────────────────────────────────────────────────────

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already seeded — skipping.");
            return;
        }
        log.info("Seeding default users...");

        userRepository.saveAll(List.of(
            User.builder()
                .name("Sierra Admin")
                .email("admin@sierrapure.in")
                .password(passwordEncoder.encode("Admin@2026"))
                .role("ADMIN")
                .isActive(true)
                .isEmailVerified(true)
                .build(),

            User.builder()
                .name("Dr. Priya Sharma")
                .email("lab@sierrapure.in")
                .password(passwordEncoder.encode("Lab@2026"))
                .role("LAB_ANALYST")
                .isActive(true)
                .isEmailVerified(true)
                .build(),

            User.builder()
                .name("Demo Client")
                .email("client@sierrapure.in")
                .password(passwordEncoder.encode("Client@2026"))
                .role("CLIENT")
                .isActive(true)
                .isEmailVerified(true)
                .build()
        ));
        log.info("Seeded 3 default users (admin / lab / client)");
    }

    // ── Lab Reports ──────────────────────────────────────────────────────

    private void seedLabReports() {
        if (labReportRepository.count() > 0) {
            log.info("Lab reports already seeded — skipping.");
            return;
        }
        log.info("Seeding sample lab reports...");

        List<LabReport> reports = List.of(
                buildReport("SP-2026-03-01-001", "BATCH-20260301-A1", LocalDate.of(2026, 3, 1),
                        "500ml", "Aqua Analytics Lab, Pune", "NABL Accredited (CC-2874)", "Dr. Priya Sharma",
                        "Water is safe for consumption. All parameters within IS 10500:2012 limits."),

                buildReport("SP-2026-02-28-001", "BATCH-20260228-A1", LocalDate.of(2026, 2, 28),
                        "200ml", "Aqua Analytics Lab, Pune", "NABL Accredited (CC-2874)", "Dr. Priya Sharma",
                        "Excellent quality batch. pH perfectly balanced."),

                buildReport("SP-2026-02-27-001", "BATCH-20260227-A1", LocalDate.of(2026, 2, 27),
                        "1000ml", "TechnoLab Solutions, Mumbai", "NABL Accredited (CC-3102)", "Mr. Rajesh Patil",
                        "All microbiological and chemical parameters cleared."),

                buildReport("SP-2026-02-26-001", "BATCH-20260226-A1", LocalDate.of(2026, 2, 26),
                        "500ml", "Aqua Analytics Lab, Pune", "NABL Accredited (CC-2874)", "Dr. Priya Sharma",
                        "Batch quality maintained above industry standards."),

                buildReport("SP-2026-02-25-001", "BATCH-20260225-A1", LocalDate.of(2026, 2, 25),
                        "200ml", "TechnoLab Solutions, Mumbai", "NABL Accredited (CC-3102)", "Mr. Rajesh Patil",
                        "All tests passed. Water suitable for airline and travel use."),

                buildReport("SP-2026-02-24-001", "BATCH-20260224-A1", LocalDate.of(2026, 2, 24),
                        "1000ml", "Aqua Analytics Lab, Pune", "NABL Accredited (CC-2874)", "Dr. Priya Sharma",
                        "Premium quality confirmed for hotel and hospitality supply.")
        );

        labReportRepository.saveAll(reports);
        log.info("Seeded {} lab reports.", reports.size());
    }

    private LabReport buildReport(String reportId, String batchNumber, LocalDate mfgDate,
                                  String bottleSize, String labName, String labCert,
                                  String testedBy, String remarks) {
        return LabReport.builder()
                .reportId(reportId)
                .batchNumber(batchNumber)
                .manufacturingDate(mfgDate)
                .reportDate(mfgDate)
                .labName(labName)
                .labCertification(labCert)
                .testedBy(testedBy)
                .bottleSize(bottleSize)
                .overallResult("PASS")
                .isPublished(true)
                .remarks(remarks)
                .parameters(sampleParameters())
                .qrCodeData("https://sierrapure.in/lab-reports/batch/" + batchNumber)
                .build();
    }

    private List<TestParameter> sampleParameters() {
        return List.of(
                TestParameter.builder().name("pH Level").value("7.2").unit("")
                        .permissibleLimit("6.5 – 8.5").method("IS 3025 Part 22").status("PASS").build(),

                TestParameter.builder().name("Total Dissolved Solids (TDS)").value("142").unit("mg/L")
                        .permissibleLimit("≤ 500").method("IS 3025 Part 16").status("PASS").build(),

                TestParameter.builder().name("Turbidity").value("0.12").unit("NTU")
                        .permissibleLimit("≤ 1").method("IS 3025 Part 10").status("PASS").build(),

                TestParameter.builder().name("Total Hardness (as CaCO₃)").value("115").unit("mg/L")
                        .permissibleLimit("≤ 300").method("IS 3025 Part 21").status("PASS").build(),

                TestParameter.builder().name("Calcium (Ca)").value("38").unit("mg/L")
                        .permissibleLimit("≤ 75").method("IS 3025 Part 40").status("PASS").build(),

                TestParameter.builder().name("Magnesium (Mg)").value("12").unit("mg/L")
                        .permissibleLimit("≤ 30").method("IS 3025 Part 41").status("PASS").build(),

                TestParameter.builder().name("Chloride (Cl⁻)").value("28").unit("mg/L")
                        .permissibleLimit("≤ 250").method("IS 3025 Part 32").status("PASS").build(),

                TestParameter.builder().name("Sulphate (SO₄²⁻)").value("18").unit("mg/L")
                        .permissibleLimit("≤ 200").method("IS 3025 Part 24").status("PASS").build(),

                TestParameter.builder().name("Nitrate (NO₃⁻)").value("8.4").unit("mg/L")
                        .permissibleLimit("≤ 45").method("IS 3025 Part 34").status("PASS").build(),

                TestParameter.builder().name("Total Coliform").value("Absent").unit("MPN/100mL")
                        .permissibleLimit("Absent").method("IS 1622").status("PASS").build(),

                TestParameter.builder().name("E. Coli / Faecal Coliform").value("Absent").unit("MPN/100mL")
                        .permissibleLimit("Absent").method("IS 1622").status("PASS").build(),

                TestParameter.builder().name("Iron (Fe)").value("0.02").unit("mg/L")
                        .permissibleLimit("≤ 0.3").method("IS 3025 Part 53").status("PASS").build(),

                TestParameter.builder().name("Fluoride (F⁻)").value("0.6").unit("mg/L")
                        .permissibleLimit("≤ 1.0").method("IS 3025 Part 60").status("PASS").build(),

                TestParameter.builder().name("Arsenic (As)").value("< 0.001").unit("mg/L")
                        .permissibleLimit("≤ 0.01").method("IS 3025 Part 37").status("PASS").build(),

                TestParameter.builder().name("Alkalinity (as CaCO₃)").value("98").unit("mg/L")
                        .permissibleLimit("≤ 200").method("IS 3025 Part 23").status("PASS").build()
        );
    }

    // ── Clients ──────────────────────────────────────────────────────────

    private void seedClients() {
        if (clientRepository.count() > 0) {
            log.info("Clients already seeded — skipping.");
            return;
        }
        log.info("Seeding sample clients...");

        List<Client> clients = List.of(

                Client.builder()
                        .name("Taj Hotels & Resorts")
                        .segment("hotel")
                        .description("India's most iconic luxury hotel chain, serving Sierra Pure 1000ml custom-branded bottles in all premium suites and restaurants.")
                        .location("Mumbai, Maharashtra")
                        .bottleSizeUsed("1000ml")
                        .testimonial("Sierra Pure has elevated our guest experience. The water quality is exceptional and the custom labels perfectly match our brand identity.")
                        .isFeatured(true)
                        .sortOrder(1)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Marriott International")
                        .segment("hotel")
                        .description("Global hotel chain using Sierra Pure 500ml and 1000ml bottles for in-room and banquet service across their Maharashtra properties.")
                        .location("Pune, Maharashtra")
                        .bottleSizeUsed("1000ml")
                        .testimonial("Consistent quality, reliable supply and stunning custom labels. Sierra Pure is our preferred water partner.")
                        .isFeatured(true)
                        .sortOrder(2)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Hyatt Regency")
                        .segment("hotel")
                        .description("Premium hospitality group using Sierra Pure for all F&B operations and conference facilities.")
                        .location("Nashik, Maharashtra")
                        .bottleSizeUsed("500ml")
                        .isFeatured(false)
                        .sortOrder(3)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("The Orchid Restaurant Group")
                        .segment("restaurant")
                        .description("Award-winning fine dining chain with 15+ outlets across Maharashtra, using Sierra Pure branded bottles for table service.")
                        .location("Pune, Maharashtra")
                        .bottleSizeUsed("500ml")
                        .testimonial("Our diners love the presentation of Sierra Pure bottles on the table. The quality is unmatched in this price range.")
                        .isFeatured(true)
                        .sortOrder(4)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Mainland China")
                        .segment("restaurant")
                        .description("Premium Chinese restaurant chain serving Sierra Pure 500ml bottles with custom restaurant branding at all tables.")
                        .location("Mumbai, Maharashtra")
                        .bottleSizeUsed("500ml")
                        .isFeatured(false)
                        .sortOrder(5)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Tata Motors Corporate Campus")
                        .segment("industry")
                        .description("Providing bulk 5000+ bottles/month for Tata Motors' Pune manufacturing campus with scheduled daily delivery.")
                        .location("Pune, Maharashtra")
                        .bottleSizeUsed("500ml")
                        .testimonial("Reliable bulk supply with zero interruptions. Sierra Pure understands industrial needs perfectly.")
                        .isFeatured(true)
                        .sortOrder(6)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Infosys BPO Campus")
                        .segment("industry")
                        .description("Daily supply of Sierra Pure 200ml and 500ml bottles for 3000+ employees across the Pune campus.")
                        .location("Hinjewadi, Pune")
                        .bottleSizeUsed("200ml")
                        .isFeatured(false)
                        .sortOrder(7)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("IndiGo Airlines (Ground Services)")
                        .segment("travel")
                        .description("Supplying compact 200ml Sierra Pure bottles for IndiGo's ground lounge and boarding gate complimentary service at Pune Airport.")
                        .location("Pune Airport, Maharashtra")
                        .bottleSizeUsed("200ml")
                        .testimonial("The 200ml bottles are perfect for our boarding gate service. Lightweight, tamper-proof and BIS certified.")
                        .isFeatured(true)
                        .sortOrder(8)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Maharashtra Tourism Board")
                        .segment("travel")
                        .description("Partnered for all state-organized tourism events, providing custom-branded 200ml bottles for tourist packages.")
                        .location("Aurangabad, Maharashtra")
                        .bottleSizeUsed("200ml")
                        .isFeatured(false)
                        .sortOrder(9)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Kalyanji Events & Wedding Planner")
                        .segment("events")
                        .description("Premium wedding and event planner using Sierra Pure custom-labeled bottles for luxury weddings, corporate events and sangeet ceremonies.")
                        .location("Nashik, Maharashtra")
                        .bottleSizeUsed("500ml")
                        .testimonial("The custom labels with our clients' wedding themes look absolutely stunning. Sierra Pure makes events memorable.")
                        .isFeatured(true)
                        .sortOrder(10)
                        .isActive(true)
                        .build(),

                Client.builder()
                        .name("Pune Half Marathon 2026")
                        .segment("events")
                        .description("Official hydration partner for Pune's largest annual marathon — supplying 50,000+ branded 200ml bottles for runners and spectators.")
                        .location("Pune, Maharashtra")
                        .bottleSizeUsed("200ml")
                        .isFeatured(false)
                        .sortOrder(11)
                        .isActive(true)
                        .build()
        );

        clientRepository.saveAll(clients);
        log.info("Seeded {} clients.", clients.size());
    }

    // ── Products ─────────────────────────────────────────────────────────

    private void seedProducts() {
        if (productRepository.count() > 0) {
            log.info("Products already seeded — skipping.");
            return;
        }
        log.info("Seeding sample products...");

        List<Product> products = List.of(

                Product.builder()
                        .name("Sierra Mini")
                        .size("200ml")
                        .category("standard")
                        .description("Compact and convenient — ideal for airlines, events, and on-the-go hydration. Lightweight, tamper-proof, and BIS certified.")
                        .features(List.of("UV Treated", "Tamper-proof Cap", "Lightweight Design", "BIS Certified", "FSSAI Licensed"))
                        .imageUrl("/api/v1/images/bottles/bottle-200ml.svg")
                        .isCustomizable(true)
                        .targetSegments(List.of("travel", "events", "airline"))
                        .priceRange("₹8 – ₹12 per bottle (bulk pricing available)")
                        .packagingInfo("Packed in shrink-wrapped trays of 48 bottles per carton")
                        .sortOrder(1)
                        .isActive(true)
                        .build(),

                Product.builder()
                        .name("Sierra Classic")
                        .size("500ml")
                        .category("premium")
                        .description("Our bestseller. 7-stage filtered premium mineral water perfect for everyday use — offices, gyms, cafes and retail.")
                        .features(List.of("7-Stage Filtration", "BIS Certified", "NABL Lab Tested", "Ergonomic Design", "Custom Label Ready"))
                        .imageUrl("/api/v1/images/bottles/bottle-500ml.svg")
                        .isCustomizable(true)
                        .targetSegments(List.of("retail", "gym", "office", "restaurant", "hotel"))
                        .priceRange("₹14 – ₹20 per bottle (bulk pricing available)")
                        .packagingInfo("Packed in shrink-wrapped trays of 24 bottles per carton")
                        .sortOrder(2)
                        .isActive(true)
                        .build(),

                Product.builder()
                        .name("Sierra Pro")
                        .size("1000ml")
                        .category("premium")
                        .description("Premium 1L bottle crafted for hotels, restaurants, and industrial supply. Custom branding available with premium label finish.")
                        .features(List.of("Premium Label Finish", "Custom Branding", "Bulk Supply Available", "7-Stage Filtration", "NABL Tested"))
                        .imageUrl("/api/v1/images/bottles/bottle-1000ml.svg")
                        .isCustomizable(true)
                        .targetSegments(List.of("hotel", "restaurant", "industry"))
                        .priceRange("₹22 – ₹32 per bottle (bulk pricing available)")
                        .packagingInfo("Packed in shrink-wrapped trays of 12 bottles per carton")
                        .sortOrder(3)
                        .isActive(true)
                        .build()
        );

        productRepository.saveAll(products);
        log.info("Seeded {} products.", products.size());
    }
}
