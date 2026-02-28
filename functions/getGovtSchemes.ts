Deno.serve(async (req) => {
  try {
    const { state, scheme_type } = await req.json();
    const targetState = state || "All India";
    const type = String(scheme_type || "").toLowerCase();

    const allSchemes = [
      {
        name_en: "PM-KISAN Income Support",
        name_hi: "पीएम-किसान आय सहायता",
        category: "subsidy",
        type: "subsidy",
        benefits_en: "Direct annual income transfer to eligible farmers.",
        benefits_hi: "पात्र किसानों को वार्षिक प्रत्यक्ष आय हस्तांतरण।",
        benefit_en: "Direct annual income transfer to eligible farmers.",
        benefit_hi: "पात्र किसानों को वार्षिक प्रत्यक्ष आय हस्तांतरण।",
        eligibility_en: ["Landholding farmer family", "Aadhaar linked bank account"],
        eligibility_hi: ["भूमिधर किसान परिवार", "आधार लिंक बैंक खाता"],
        subsidy_amount: "INR 6000 per year",
        documents_required: ["Aadhaar", "Land record", "Bank passbook"],
        how_to_apply_en: "Apply via PM-KISAN portal or nearest CSC center.",
        how_to_apply_hi: "पीएम-किसान पोर्टल या नजदीकी CSC केंद्र से आवेदन करें।",
        deadline: "Rolling enrollment",
        website: "https://pmkisan.gov.in/",
        helpline: "155261",
      },
      {
        name_en: "PMFBY Crop Insurance",
        name_hi: "प्रधानमंत्री फसल बीमा योजना",
        category: "insurance",
        type: "insurance",
        benefits_en: "Insurance cover for crop losses due to natural calamities.",
        benefits_hi: "प्राकृतिक आपदाओं से फसल हानि पर बीमा सुरक्षा।",
        benefit_en: "Insurance cover for crop losses due to natural calamities.",
        benefit_hi: "प्राकृतिक आपदाओं से फसल हानि पर बीमा सुरक्षा।",
        eligibility_en: ["Sown crop in notified area", "Registered farmer"],
        eligibility_hi: ["अधिसूचित क्षेत्र में बोई गई फसल", "पंजीकृत किसान"],
        subsidy_amount: "Highly subsidized premium",
        documents_required: ["Aadhaar", "Bank account", "Sowing proof"],
        how_to_apply_en: "Apply through insurance portal, bank, or local agriculture office.",
        how_to_apply_hi: "बीमा पोर्टल, बैंक या स्थानीय कृषि कार्यालय से आवेदन करें।",
        deadline: "Before sowing season",
        website: "https://pmfby.gov.in/",
        helpline: "14447",
      },
      {
        name_en: "Solar Pump Subsidy (PM KUSUM)",
        name_hi: "सोलर पंप सब्सिडी (पीएम कुसुम)",
        category: "equipment",
        type: "equipment",
        benefits_en: "Capital subsidy for solar irrigation pumps.",
        benefits_hi: "सौर सिंचाई पंप हेतु पूंजी सब्सिडी।",
        benefit_en: "Capital subsidy for solar irrigation pumps.",
        benefit_hi: "सौर सिंचाई पंप हेतु पूंजी सब्सिडी।",
        eligibility_en: ["Small/medium farmers", "Eligible feeder area"],
        eligibility_hi: ["लघु/मध्यम किसान", "पात्र फीडर क्षेत्र"],
        subsidy_amount: "Up to 60% (state dependent)",
        documents_required: ["Aadhaar", "Land papers", "Electricity details"],
        how_to_apply_en: "Apply through state renewable agency portal.",
        how_to_apply_hi: "राज्य नवीकरणीय एजेंसी पोर्टल से आवेदन करें।",
        deadline: "As per state notification",
        website: "https://mnre.gov.in/",
        helpline: "1800-180-3333",
      },
    ].map((scheme) => ({ ...scheme, state: targetState }));

    const schemes = type ? allSchemes.filter((scheme) => scheme.type.includes(type)) : allSchemes;

    return Response.json({
      success: true,
      data: {
        schemes,
        kisan_helpline: "1800-180-1551",
        important_notice: {
          en: "Always verify latest eligibility and deadlines on official portals.",
          hi: "नवीनतम पात्रता और अंतिम तिथि हमेशा आधिकारिक पोर्टल पर सत्यापित करें।",
        },
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
