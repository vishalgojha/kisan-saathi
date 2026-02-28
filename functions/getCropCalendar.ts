Deno.serve(async (req) => {
  try {
    const { crop, state, month } = await req.json();
    const cropName = crop || "Wheat";
    const cropNameHi = cropName === "Wheat" ? "गेहूं" : cropName;
    const monthName = month || new Date().toLocaleString("en-US", { month: "long" });

    const data = {
      current_month: monthName,
      region: state || "India",
      crop_name_hi: cropNameHi,
      season: "Current season",
      activities: [
        {
          type: "irrigation",
          title_en: "Irrigation planning",
          title_hi: "सिंचाई योजना",
          description_en: `Maintain light and timely irrigation for ${cropName}.`,
          description_hi: `${cropNameHi} के लिए हल्की और समय पर सिंचाई करें।`,
        },
        {
          type: "fertilizer",
          title_en: "Nutrient management",
          title_hi: "पोषक तत्व प्रबंधन",
          description_en: "Apply split NPK doses based on crop growth stage.",
          description_hi: "फसल की अवस्था के अनुसार NPK की विभाजित खुराक दें।",
        },
        {
          type: "pest_control",
          title_en: "Pest scouting",
          title_hi: "कीट निगरानी",
          description_en: "Inspect plants every 3-4 days and treat early symptoms.",
          description_hi: "हर 3-4 दिन में निरीक्षण करें और शुरुआती लक्षणों पर उपचार करें।",
        },
      ],
      market_advice: {
        en: "Track mandi arrivals and spread sales in batches for better realization.",
        hi: "मंडी आवक पर नजर रखें और बेहतर भाव के लिए चरणबद्ध बिक्री करें।",
      },
      weather_tips: {
        en: "Monitor rain forecast to plan irrigation and spray windows.",
        hi: "सिंचाई और छिड़काव योजना के लिए बारिश पूर्वानुमान पर नजर रखें।",
      },
    };

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
