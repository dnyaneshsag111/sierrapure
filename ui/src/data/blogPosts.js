// Static blog article data — Sprint 4
export const BLOG_POSTS = [
  {
    slug: 'why-tds-matters-drinking-water',
    title: 'Why TDS Matters in Drinking Water',
    subtitle: 'Total Dissolved Solids explained — what the number means for your health and why 150–250 mg/L is the sweet spot.',
    category: 'Water Science',
    readTime: '4 min read',
    date: 'March 1, 2026',
    coverEmoji: '🔬',
    coverGradient: 'linear-gradient(135deg, #0A2342, #1565C0)',
    excerpt: 'TDS is one of the most cited — and most misunderstood — numbers in drinking water. Here is what it actually means.',
    content: `
## What Is TDS?

**Total Dissolved Solids (TDS)** refers to the total concentration of dissolved substances in water — minerals like calcium, magnesium, potassium, sodium, bicarbonates, chlorides, and sulphates. It is measured in milligrams per litre (mg/L) or parts per million (ppm).

A high TDS means more dissolved material. A low TDS means purer water — but "purer" doesn't always mean healthier.

---

## The TDS Spectrum

| TDS Range | Classification | Typical Source |
|-----------|---------------|---------------|
| 0 – 50 mg/L | Very Low | Distilled or RO water |
| 50 – 150 mg/L | Low | Some spring water |
| 150 – 250 mg/L | Ideal | Premium mineral water |
| 250 – 500 mg/L | Acceptable | Municipal water |
| 500+ mg/L | High | Hard groundwater |

---

## Why Zero TDS Is Not Ideal

Marketing around "zero TDS" or "100% pure" water misses an important biological fact: **minerals in water are absorbed efficiently by the body**. The WHO states that water with a TDS below 100 mg/L may actually be harmful over long-term consumption because it can leach minerals from the body.

Distilled or RO water at 0–30 mg/L is essentially stripped of all ions. It tastes flat, and regular consumption can lead to mineral deficiencies, especially in communities already low on calcium and magnesium intake.

---

## The BIS Standard

The Bureau of Indian Standards (BIS IS 14543) recommends a TDS range of **100–500 mg/L** for packaged drinking water. For **natural mineral water (IS 13428)**, the acceptable range is broader, but the optimal health range is considered **150–250 mg/L**.

Sierra Pure mineral water is tested daily and consistently reports a TDS between **142–185 mg/L** — right in the ideal window.

---

## How to Read a TDS Reading

When you see a TDS value:
- **Don't just look at the number** — look at *what* makes up that TDS.
- Calcium (Ca²⁺) and Magnesium (Mg²⁺) at healthy levels are good.
- High sodium (Na⁺) or chlorides (Cl⁻) are less desirable.

Sierra Pure's lab reports publish exact mineral breakdown — not just the TDS total — so you know exactly what you're drinking.

---

## Conclusion

TDS is a useful indicator but not the complete story. The ideal drinking water has:
- TDS between **150–250 mg/L**
- A balanced mineral profile (Ca, Mg, K)
- Low sodium and sulphates
- pH between 7.0 and 7.5

Every Sierra Pure batch is tested for all of these parameters — and the full report is accessible via the QR code on every bottle.

> **Scan any Sierra Pure bottle's QR code to see the exact TDS and mineral breakdown for that batch.**
    `,
  },
  {
    slug: '7-stage-filtration-explained',
    title: '7-Stage Filtration: What Happens Before the Bottle Is Sealed',
    subtitle: 'A step-by-step breakdown of how Sierra Pure transforms source water into the premium mineral water in your bottle.',
    category: 'Our Process',
    readTime: '5 min read',
    date: 'February 22, 2026',
    coverEmoji: '💧',
    coverGradient: 'linear-gradient(135deg, #0A3A2A, #1a8a4a)',
    excerpt: 'Filtration is not a single step — it is a carefully sequenced 7-stage process. Here is exactly what happens at each stage.',
    content: `
## The Journey of Every Drop

Before a Sierra Pure bottle is sealed and dispatched, the source water passes through 7 distinct filtration and treatment stages. Each stage targets a specific class of impurities or enhances a specific quality parameter.

---

## Stage 1 — Sediment Pre-Filter (5 micron)

The first stage removes visible particles: sand, rust, dirt, suspended solids. A 5-micron polypropylene sediment filter captures particles down to one-twentieth the width of a human hair. This protects the downstream stages from early clogging.

---

## Stage 2 — Activated Carbon Block Filter

Activated carbon is one of the most effective natural adsorbents known to science. This stage removes:
- Chlorine and chloramines (added to municipal supply water)
- Volatile organic compounds (VOCs)
- Taste-causing compounds (earthy, musty, or chemical odours)

The result: water that smells and tastes neutral before further processing.

---

## Stage 3 — Reverse Osmosis (RO) Membrane

The RO membrane has pores of approximately **0.0001 microns** — small enough to block dissolved salts, heavy metals (lead, arsenic), fluorides, nitrates, and most bacteria and viruses. Water is forced under pressure through the semi-permeable membrane; only pure H₂O molecules pass through.

**Note:** RO removes nearly everything — including beneficial minerals. That is why stages 4 and 5 are critical.

---

## Stage 4 — UV Disinfection

After RO, water passes under a high-intensity ultraviolet (UV) lamp. UV light at 254 nm wavelength destroys the DNA of any remaining bacteria, viruses, and protozoa — including E. coli, Giardia, and Cryptosporidium. This stage does not add any chemicals.

---

## Stage 5 — Mineral Dosing (Remineralisation)

Post-RO water is too pure for optimal health. This stage adds back carefully measured quantities of:
- **Calcium bicarbonate** — for bone and dental health
- **Magnesium sulphate** — for muscle and nerve function
- **Potassium chloride** — for blood pressure regulation

Minerals are added to match BIS IS 13428 specifications and WHO recommended health ranges.

---

## Stage 6 — Ozone Treatment

Ozone (O₃) is used as a final sterilisation step. It is a powerful oxidising agent that destroys any residual microorganisms, then breaks down into oxygen — leaving no chemical residue. Ozone treatment also extends the shelf life of the final product.

---

## Stage 7 — Quality Assurance Testing

The final stage is not a filter — it is a lab test. Before any batch is bottled, a water sample is sent to our **NABL-accredited laboratory** for analysis of:
- TDS, pH, turbidity, conductivity
- Microbial parameters (Total Coliform, E. coli, HPC count)
- Heavy metals (lead, arsenic, chromium, cadmium)
- Mineral profile (Ca, Mg, Na, K, bicarbonates, sulphates)

Only batches that pass all parameters are cleared for bottling. The test report is then linked to the batch QR code and published publicly on our lab reports portal.

---

## End Result

Water that enters our facility as source groundwater leaves as **certified, lab-tested, mineral-balanced Sierra Pure** — with a complete digital audit trail you can verify by scanning the QR code on any bottle.

> **Each stage exists for a reason. Each test result is public. That is the Sierra Pure standard.**
    `,
  },
  {
    slug: 'how-to-read-water-lab-report',
    title: 'How to Read Your Water Lab Report',
    subtitle: 'Lab reports contain dozens of parameters. This guide explains which ones matter most and what the values mean for your health.',
    category: 'Transparency',
    readTime: '6 min read',
    date: 'February 10, 2026',
    coverEmoji: '📋',
    coverGradient: 'linear-gradient(135deg, #2C1654, #9B59B6)',
    excerpt: 'Sierra Pure publishes full NABL lab reports for every batch. Here is how to read them and understand what the numbers mean.',
    content: `
## Why Lab Reports Matter

Any water company can claim "pure" and "tested." What separates Sierra Pure is that **every batch report is publicly available** — searchable by batch number, filterable by date, and instantly accessible by scanning the QR code on the bottle.

But a lab report has 30+ parameters. Which ones should you actually pay attention to?

---

## Section 1 — Physical Parameters

### TDS (Total Dissolved Solids)
- **Unit:** mg/L
- **Sierra Pure range:** 142–185 mg/L
- **BIS limit:** ≤ 500 mg/L
- **What it means:** Total mineral content. Our range is in the "ideal" zone for balanced mineral intake.

### pH
- **Unit:** Unitless (scale 0–14)
- **Sierra Pure range:** 7.0–7.5
- **BIS limit:** 6.5–8.5
- **What it means:** Acidity/alkalinity. 7.0 is neutral. Human blood is ~7.4. Our pH is deliberately matched to body physiology.

### Turbidity
- **Unit:** NTU (Nephelometric Turbidity Units)
- **Sierra Pure range:** < 0.1 NTU
- **BIS limit:** ≤ 1 NTU
- **What it means:** Visual clarity. Lower is clearer. Our water is essentially optically clear.

### Conductivity
- **Unit:** µS/cm (microsiemens per centimetre)
- **What it means:** Directly related to TDS. Shows how well the water conducts electricity (a proxy for ion content).

---

## Section 2 — Chemical Parameters (Key Minerals)

### Calcium (Ca²⁺)
- **Sierra Pure:** ~32 mg/L | **BIS limit:** ≤ 75 mg/L
- Supports bone density, nerve function, and muscle contraction.

### Magnesium (Mg²⁺)
- **Sierra Pure:** ~12 mg/L | **BIS limit:** ≤ 30 mg/L
- Aids enzyme reactions, regulates blood pressure, essential for heart function.

### Sodium (Na⁺)
- **Sierra Pure:** ~8 mg/L | **BIS limit:** ≤ 200 mg/L
- Very low — good for those monitoring cardiovascular health or hypertension.

### Potassium (K⁺)
- **Sierra Pure:** ~4 mg/L | **BIS limit:** ≤ 12 mg/L
- Electrolyte that balances sodium; critical for muscle and nerve health.

### Bicarbonates (HCO₃⁻)
- **Sierra Pure:** ~95 mg/L | **BIS limit:** ≤ 600 mg/L
- Natural alkalinity buffer. Aids digestion and maintains blood pH.

### Sulphates (SO₄²⁻)
- **Sierra Pure:** ~6 mg/L | **BIS limit:** ≤ 200 mg/L
- Very low — high sulphates cause laxative effects. Ours is well below threshold.

---

## Section 3 — Heavy Metals (Must Be Zero or Near-Zero)

These parameters should always read **Not Detected (ND)** or below the detection limit:

| Parameter | BIS Limit | Sierra Pure |
|-----------|-----------|-------------|
| Lead (Pb) | ≤ 0.01 mg/L | ND |
| Arsenic (As) | ≤ 0.01 mg/L | ND |
| Cadmium (Cd) | ≤ 0.003 mg/L | ND |
| Mercury (Hg) | ≤ 0.001 mg/L | ND |
| Chromium (Cr) | ≤ 0.05 mg/L | ND |

---

## Section 4 — Microbiological Parameters (Most Critical)

These parameters determine if water is safe to drink. All must be **zero**.

| Test | Required Result | Sierra Pure |
|------|----------------|-------------|
| Total Coliform Count | Absent in 100ml | Absent |
| E. coli / Faecal Coliform | Absent in 100ml | Absent |
| Heterotrophic Plate Count (HPC) | ≤ 500 CFU/ml | < 1 CFU/ml |
| Yeast & Mould | Absent | Absent |

A single batch failing any microbiological test means the entire batch is destroyed and not dispatched.

---

## How to Access Sierra Pure's Reports

1. **Scan the QR code** on any Sierra Pure bottle — opens the exact report for that batch
2. Visit **[sierrapure.in/lab-reports](/)** — search by batch number or filter by date
3. Download the **PDF** of any report for your records or vendor documentation

> **If a brand won't show you their lab report, ask yourself why.**
    `,
  },
  {
    slug: 'mineral-water-vs-ro-water-for-hotels',
    title: 'Mineral Water vs. RO Water: Which Should Hotels Serve?',
    subtitle: 'A practical guide for hotel procurement managers comparing cost, guest perception, compliance, and health impact.',
    category: 'B2B Guide',
    readTime: '5 min read',
    date: 'January 28, 2026',
    coverEmoji: '🏨',
    coverGradient: 'linear-gradient(135deg, #7B3F00, #C9A84C)',
    excerpt: 'Hotels face a choice: RO-filtered water or certified mineral water. The right answer depends on more than just cost per litre.',
    content: `
## The Hotel Hydration Decision

For hotel procurement managers, the water decision involves multiple dimensions: **cost per litre, guest perception, FSSAI compliance, mineral health value, and brand presentation**. This guide breaks down each dimension.

---

## The Core Difference

| Factor | RO Filtered Water | Natural Mineral Water |
|--------|-------------------|----------------------|
| TDS | 10–50 mg/L (very low) | 150–250 mg/L (optimal) |
| Mineral content | Nearly zero | Ca, Mg, K, bicarbonates |
| Taste | Flat, neutral | Crisp, slightly minerally |
| BIS certification possible | IS 14543 (packaged drinking water) | IS 13428 (mineral water) — higher standard |
| Shelf life | 6 months | 12 months |
| Cost | Lower | Slightly higher |

---

## What Guests Actually Notice

In hospitality, **perception is reality**. Guests make split-second judgements about room quality, and the water bottle on the desk or in the minibar is part of that signal.

Studies on hotel guest preferences consistently show:
- Guests associate **clearly labelled mineral water** with higher room quality
- A labelled, certified mineral water bottle scores higher on "attention to detail" ratings than unlabelled purified water
- Business travellers (the most profitable segment) are more likely to notice and appreciate premium water

---

## The Compliance Angle

Hotels serving food and beverages are governed by FSSAI regulations. Serving water that is:
- Stored in unlabelled or bulk containers
- Without a legible batch date and certification
- Without a traceable production record

...creates compliance risk, especially during FSSAI inspections.

Sierra Pure mineral water is **FSSAI licensed, BIS IS 13428 certified**, and every batch has a publicly accessible lab report. This gives your purchasing team a complete paper trail for compliance documentation.

---

## Custom Labelling — The Brand Opportunity

Many 4-star and 5-star hotels now serve water with their own hotel logo on the bottle. This is standard practice in premium hospitality globally.

Sierra Pure offers:
- **Custom label design** included (1 design, 3 revision rounds)
- Minimum order: 500 units per batch
- All 3 sizes: 200ml (room amenity), 500ml (restaurant), 1000ml (dining room)
- Lead time: 7–10 days after label approval

The cost delta between branded and unbranded water is often less than ₹1.50 per bottle — while the perceived value increase to guests is significantly higher.

---

## The Real Cost Comparison

Let us look at a 50-room hotel using 4 bottles per room per day:

| Water Type | Cost/Bottle | Daily Cost | Monthly Cost |
|-----------|-------------|------------|--------------|
| RO in-house (capex + maintenance) | ₹3–5 | ₹600–1,000 | ₹18,000–30,000 |
| Generic packaged water | ₹7–9 | ₹1,400–1,800 | ₹42,000–54,000 |
| Sierra Pure (custom label, bulk) | ₹10–13 | ₹2,000–2,600 | ₹60,000–78,000 |

The Sierra Pure premium over generic water: **₹18,000–24,000/month** for a 50-room hotel.

Against a typical room rate of ₹3,000–8,000/night, this is less than **₹12 per room per night** — a negligible addition that pays for itself in guest satisfaction scores.

---

## Our Recommendation

For **budget hotels and guesthouses:** RO water with BIS IS 14543 certified packaged water is practical and compliant.

For **3-star and above:** Sierra Pure with custom label delivers the best balance of compliance, guest perception, and brand value. The custom label is a tangible signal to guests that you care about their stay.

For **5-star and luxury properties:** Custom labelled premium mineral water is non-negotiable. It is a standard feature guests expect.

---

## Next Step

Contact our B2B team for a **complimentary sample kit** and a custom label mockup for your hotel. We will show you exactly what the bottle would look like with your branding before you commit to an order.

> **WhatsApp us directly or fill the enquiry form — our team responds within 4 hours during business hours.**
    `,
  },
];
