Deno.serve(async (req) => {
  try {
    const { crop_name, symptoms } = await req.json();

    const crop = crop_name || "Crop";
    const cropHi = crop_name || "फसल";
    const symptomText = String(symptoms || "").toLowerCase();
    const likelyIssue = symptomText.includes("yellow")
      ? "Nutrient Deficiency"
      : "Fungal Leaf Spot";

    const data = {
      diagnosis: {
        problem_name_en: `${crop} - ${likelyIssue}`,
        problem_name_hi: `${cropHi} - संभावित समस्या`,
        problem_type: likelyIssue.includes("Nutrient") ? "Deficiency" : "Disease",
        cause_en: "Likely linked to humidity fluctuation and nutrition imbalance.",
        cause_hi: "संभावित कारण नमी में उतार-चढ़ाव और पोषण असंतुलन है।",
        severity: "Moderate",
        spread_risk: "Medium",
      },
      organic_treatments: [
        {
          name_en: "Neem extract spray",
          name_hi: "नीम अर्क छिड़काव",
          ingredients: "Neem oil + emulsifier",
          dosage: "5 ml per liter",
          application_en: "Spray in evening on both leaf surfaces.",
          application_hi: "शाम को पत्तियों के दोनों तरफ छिड़काव करें।",
          frequency: "Every 5-7 days",
        },
      ],
      chemical_treatments: [
        {
          product_name: "Mancozeb 75 WP",
          active_ingredient: "Mancozeb",
          dosage_per_liter: "2 g/L",
          dosage_per_acre: "500 g/acre",
          application_method_en: "Uniform foliar spray.",
          application_method_hi: "समान रूप से पर्णीय छिड़काव करें।",
          best_time: "Late afternoon",
          safety_interval_days: 10,
          precautions_en: "Use gloves and mask while spraying.",
          precautions_hi: "छिड़काव के समय दस्ताने और मास्क पहनें।",
        },
      ],
      prevention: {
        measures_en: [
          "Avoid overhead irrigation during late evening.",
          "Maintain recommended plant spacing.",
        ],
        measures_hi: [
          "देर शाम ऊपर से सिंचाई से बचें।",
          "अनुशंसित पौध दूरी बनाए रखें।",
        ],
      },
      emergency_action: {
        needed: false,
        action_en: "Not critical. Start treatment in the next 24 hours.",
        action_hi: "गंभीर नहीं। अगले 24 घंटे में उपचार शुरू करें।",
      },
      additional_advice: {
        en: "Reassess after one week with fresh images.",
        hi: "एक सप्ताह बाद नई तस्वीर के साथ पुनः जांच करें।",
      },
    };

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
