package com.mineralwater.sierrapure.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestParameter {

    private String name;        // e.g., "pH Level", "TDS", "Turbidity"
    private String value;       // e.g., "7.2", "142", "Absent"
    private String unit;        // e.g., "mg/L", "NTU", ""
    private String permissibleLimit; // e.g., "6.5 - 8.5", "< 500"
    private String status;      // PASS or FAIL
    private String method;      // Testing method (optional)
}
