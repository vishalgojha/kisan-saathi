type AnyRecord = Record<string, any>;

const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_NAMES_HI = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];

const cropBasePrices: Record<string, number> = {
  wheat: 2400,
  rice: 2600,
  soybean: 5200,
  gram: 5400,
  maize: 2100,
  onion: 1800,
  tomato: 1600,
  potato: 1500,
  mustard: 6000,
  cotton: 7400,
};

const hash = (value: string) =>
  value.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

function buildForecast(days: number, seed: number) {
  const safeDays = clamp(days || 3, 1, 7);
  const forecast = [];

  for (let i = 0; i < safeDays; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const drift = ((seed + i * 7) % 9) - 4;
    const maxTemp = 28 + drift;
    const minTemp = maxTemp - 8;
    const rainChance = clamp(20 + ((seed + i * 11) % 70), 5, 95);
    const rainy = rainChance > 55;
    const cloudy = rainChance > 35 && rainChance <= 55;

    const condition = rainy ? "Rainy" : cloudy ? "Cloudy" : "Sunny";
    const conditionHi = rainy ? "बारिश" : cloudy ? "बादल" : "धूप";

    forecast.push({
      date: toDateKey(date),
      day_name: DAY_NAMES_EN[date.getDay()],
      day_name_hi: DAY_NAMES_HI[date.getDay()],
      max_temp: maxTemp,
      min_temp: minTemp,
      condition,
      condition_hi: conditionHi,
      rain_chance: rainChance,
    });
  }

  return forecast;
}

function buildMandiRows(crop: string, state: string, district: string) {
  const normalizedCrop = (crop || "wheat").toLowerCase();
  const seed = hash(`${normalizedCrop}:${state}:${district}`);
  const base = cropBasePrices[normalizedCrop] || 2500;
  const mandiNames = [
    district || "Central Mandi",
    "APMC Yard",
    "Wholesale Market",
    "Krishi Upaj Mandi",
    "Regional Agri Market",
  ];

  const rows = mandiNames.map((mandi, index) => {
    const variation = ((seed + index * 17) % 401) - 200;
    const modal = Math.max(500, base + variation);
    const min = Math.max(300, modal - (70 + (index % 3) * 20));
    const max = modal + (80 + (index % 4) * 25);
    const trendScore = (seed + index * 5) % 3;
    const trend = trendScore === 0 ? "up" : trendScore === 1 ? "down" : "stable";

    return {
      mandi,
      district: district || "Local District",
      state: state || "India",
      min_price: min,
      max_price: max,
      modal_price: modal,
      trend,
    };
  });

  return rows.sort((a, b) => b.modal_price - a.modal_price);
}

function buildSchemeRows(state: string) {
  const targetState = state || "All India";
  return [
    {
      name_en: "PM-KISAN Income Support",
      name_hi: "पीएम-किसान आय सहायता",
      category: "subsidy",
      type: "subsidy",
      benefits_en: "Direct income transfer to eligible farmer families.",
      benefits_hi: "पात्र किसान परिवारों को प्रत्यक्ष आय सहायता।",
      benefit_en: "Direct income transfer to eligible farmer families.",
      benefit_hi: "पात्र किसान परिवारों को प्रत्यक्ष आय सहायता।",
      eligibility_en: ["Landholding farmer family", "Valid Aadhaar linked account"],
      eligibility_hi: ["भूमिधर किसान परिवार", "आधार से लिंक बैंक खाता"],
      subsidy_amount: "INR 6000 per year",
      documents_required: ["Aadhaar", "Bank passbook", "Land record"],
      how_to_apply_en: "Apply through the PM-KISAN portal or nearest CSC center.",
      how_to_apply_hi: "पीएम-किसान पोर्टल या नजदीकी सीएससी केंद्र से आवेदन करें।",
      deadline: "Rolling enrollment",
      website: "https://pmkisan.gov.in/",
      helpline: "155261",
      state: targetState,
    },
    {
      name_en: "PMFBY Crop Insurance",
      name_hi: "प्रधानमंत्री फसल बीमा योजना",
      category: "insurance",
      type: "insurance",
      benefits_en: "Risk coverage for crop failure due to natural calamities.",
      benefits_hi: "प्राकृतिक आपदाओं से फसल हानि पर जोखिम कवर।",
      benefit_en: "Risk coverage for crop failure due to natural calamities.",
      benefit_hi: "प्राकृतिक आपदाओं से फसल हानि पर जोखिम कवर।",
      eligibility_en: ["Enrolled farmers", "Insurable crop in notified area"],
      eligibility_hi: ["पंजीकृत किसान", "अधिसूचित क्षेत्र में बीमायोग्य फसल"],
      subsidy_amount: "Premium heavily subsidized",
      documents_required: ["Aadhaar", "Bank account", "Sowing certificate"],
      how_to_apply_en: "Apply via insurance portal, bank, or agriculture office.",
      how_to_apply_hi: "बीमा पोर्टल, बैंक या कृषि कार्यालय से आवेदन करें।",
      deadline: "Before sowing season",
      website: "https://pmfby.gov.in/",
      helpline: "14447",
      state: targetState,
    },
    {
      name_en: "Solar Pump Subsidy",
      name_hi: "सोलर पंप सब्सिडी",
      category: "equipment",
      type: "equipment",
      benefits_en: "Subsidy support for solar irrigation pumps.",
      benefits_hi: "सौर सिंचाई पंप हेतु सब्सिडी सहायता।",
      benefit_en: "Subsidy support for solar irrigation pumps.",
      benefit_hi: "सौर सिंचाई पंप हेतु सब्सिडी सहायता।",
      eligibility_en: ["Small and medium farmers", "Grid/off-grid viable location"],
      eligibility_hi: ["लघु और मध्यम किसान", "ग्रिड/ऑफ-ग्रिड उपयुक्त स्थान"],
      subsidy_amount: "Up to 60% (state dependent)",
      documents_required: ["Aadhaar", "Land papers", "Electricity details"],
      how_to_apply_en: "Apply through state nodal renewable energy agency.",
      how_to_apply_hi: "राज्य नोडल नवीकरणीय ऊर्जा एजेंसी के माध्यम से आवेदन करें।",
      deadline: "State-wise notifications",
      website: "https://mnre.gov.in/",
      helpline: "1800-180-3333",
      state: targetState,
    },
  ];
}

function buildCropCalendar(crop: string, month: string) {
  const cropName = crop || "Wheat";
  const cropNameHi = cropName === "Wheat" ? "गेहूं" : cropName;
  const monthName = month || new Date().toLocaleString("en-US", { month: "long" });

  return {
    current_month: monthName,
    crop_name_hi: cropNameHi,
    activities: [
      {
        type: "irrigation",
        title_en: "Irrigation planning",
        title_hi: "सिंचाई योजना",
        description_en: `Maintain light irrigation for ${cropName} during this stage.`,
        description_hi: `${cropNameHi} के लिए इस चरण में हल्की सिंचाई बनाए रखें।`,
      },
      {
        type: "fertilizer",
        title_en: "Nutrient top-up",
        title_hi: "पोषक तत्व पूरक",
        description_en: "Apply balanced NPK and micronutrients as per soil health card.",
        description_hi: "मृदा स्वास्थ्य कार्ड के अनुसार संतुलित NPK और सूक्ष्म पोषक दें।",
      },
      {
        type: "pest_control",
        title_en: "Pest scouting",
        title_hi: "कीट निगरानी",
        description_en: "Inspect leaves every 3-4 days and act early on infestation signs.",
        description_hi: "हर 3-4 दिन पत्तियों की जांच करें और संक्रमण के संकेत पर जल्दी कार्रवाई करें।",
      },
    ],
    market_advice: {
      en: "Track local mandi arrivals and stagger sales to avoid low-price windows.",
      hi: "स्थानीय मंडी आवक पर नजर रखें और कम भाव के समय से बचते हुए बिक्री करें।",
    },
  };
}

function buildRenewableEnergy(location: string, state: string, farmAreaAcres: number) {
  const area = Math.max(1, Number(farmAreaAcres || 5));
  const dailySolar = Number((area * 4.6).toFixed(2));
  const dailyWind = Number((area * 1.4).toFixed(2));
  const monthlySavings = Number(((dailySolar + dailyWind) * 30 * 7).toFixed(2));
  const solarInstall = Math.round(area * 50000);
  const subsidy = Math.round(solarInstall * 0.3);
  const paybackYears = Number(((solarInstall - subsidy) / (monthlySavings * 12)).toFixed(1));

  const dailyTrends = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx);
    const multiplier = 0.9 + ((idx % 4) * 0.05);
    return {
      date: toDateKey(date),
      solar_kwh: Number((dailySolar * multiplier).toFixed(2)),
      wind_kwh: Number((dailyWind * (1 + (idx % 3) * 0.08)).toFixed(2)),
      sun_hours: Number((5.1 + (idx % 4) * 0.2).toFixed(1)),
      wind_speed: Number((3.8 + (idx % 3) * 0.3).toFixed(1)),
    };
  });

  return {
    solar_potential: {
      daily_kwh: dailySolar,
      monthly_kwh: Number((dailySolar * 30).toFixed(2)),
      yearly_kwh: Number((dailySolar * 365).toFixed(2)),
      peak_sun_hours: 5.6,
      recommended_capacity_kw: Number((area * 0.5).toFixed(2)),
      panel_area_required_sqm: Number((area * 2.6).toFixed(2)),
    },
    wind_potential: {
      avg_wind_speed_mps: 4.2,
      feasibility: dailyWind > 0 ? "Feasible" : "Not Feasible",
      daily_kwh: dailyWind,
      monthly_kwh: Number((dailyWind * 30).toFixed(2)),
      yearly_kwh: Number((dailyWind * 365).toFixed(2)),
      recommended_turbine_size_kw: 3,
      height_required_meters: 12,
    },
    cost_analysis: {
      solar_installation_cost_inr: solarInstall,
      wind_installation_cost_inr: Math.round(area * 30000),
      monthly_savings_inr: monthlySavings,
      payback_period_years: paybackYears,
      govt_subsidy_available_inr: subsidy,
    },
    daily_trends: dailyTrends,
    weather_data: {
      avg_sun_hours: 5.6,
      avg_temp: 31.2,
      avg_wind_speed: 4.2,
    },
    seasonal_output: [
      { season: "Summer", solar_efficiency_percent: 92, wind_efficiency_percent: 78 },
      { season: "Monsoon", solar_efficiency_percent: 74, wind_efficiency_percent: 88 },
      { season: "Winter", solar_efficiency_percent: 85, wind_efficiency_percent: 72 },
    ],
    recommendations: {
      solar_placement_en: `Install panels facing south with 20-25 degree tilt for ${location}, ${state}.`,
      solar_placement_hi: `${location}, ${state} में पैनल दक्षिण दिशा में 20-25 डिग्री झुकाव के साथ लगाएं।`,
      wind_placement_en: "Place turbines on open boundaries away from tree turbulence.",
      wind_placement_hi: "टर्बाइन खुले खेत किनारों पर पेड़ों से दूर लगाएं।",
      best_option_en: "Hybrid solar + efficient pumps offers best return for most farms.",
      best_option_hi: "अधिकांश खेतों के लिए सोलर + कुशल पंप का संयोजन बेहतर रिटर्न देता है।",
      additional_tips_en: [
        "Clean panels every 10-15 days.",
        "Use net-metering if available in your state.",
      ],
      additional_tips_hi: [
        "हर 10-15 दिन में पैनल साफ करें।",
        "राज्य में उपलब्ध हो तो नेट-मीटरिंग अपनाएं।",
      ],
    },
    subsidies: [
      {
        scheme_name_en: "PM KUSUM Component-B",
        scheme_name_hi: "पीएम कुसुम कंपोनेंट-बी",
        subsidy_percent: 30,
        max_amount_inr: 300000,
      },
    ],
  };
}

function buildDiagnosis(cropName: string, symptoms: string) {
  const crop = cropName || "Crop";
  const cropHi = cropName || "फसल";
  const likelyIssue =
    symptoms && symptoms.toLowerCase().includes("yellow")
      ? "Nutrient Deficiency"
      : "Fungal Leaf Spot";

  return {
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
}

function buildNutrientRecommendations(prompt: string) {
  const lower = prompt.toLowerCase();
  const knownCrops = [
    "wheat",
    "rice",
    "soybean",
    "gram",
    "maize",
    "mustard",
    "cotton",
    "tomato",
    "potato",
    "onion",
  ];

  const crops = knownCrops.filter((crop) => lower.includes(crop)).slice(0, 2);
  const finalCrops = crops.length > 0 ? crops : ["wheat", "rice"];

  return {
    recommendations: finalCrops.map((crop) => ({
      crop: crop[0].toUpperCase() + crop.slice(1),
      npk_ratio: crop === "rice" ? "120:60:40" : "100:50:40",
      stage: "Vegetative growth",
      tips_en: "Use split nitrogen doses and maintain soil moisture.",
      tips_hi: "नाइट्रोजन की खुराक विभाजित करें और मिट्टी में नमी बनाए रखें।",
      organic_option_en: "Apply vermicompost and jeevamrit every 15 days.",
      organic_option_hi: "हर 15 दिन में वर्मी-कम्पोस्ट और जीवामृत दें।",
    })),
  };
}

export async function runMockFunction(name: string, payload: AnyRecord = {}) {
  switch (name) {
    case "getWeather": {
      const location = payload.location || "Local Area";
      const seed = hash(location);
      const forecast = buildForecast(Number(payload.days || 3), seed);
      const current = forecast[0];
      return {
        location,
        current: {
          temperature: current.max_temp - 2,
          humidity: clamp(48 + (seed % 40), 30, 90),
          wind_speed: clamp(8 + (seed % 18), 5, 30),
          condition: current.condition,
          condition_hi: current.condition_hi,
        },
        forecast,
        farming_advisory: {
          en: "Prefer early morning field operations; monitor humidity-related disease pressure.",
          hi: "सुबह जल्दी खेत कार्य करें; नमी से जुड़ी बीमारियों पर नजर रखें।",
        },
        irrigation_advice: {
          en: "Plan irrigation based on rain probability in the next 24-48 hours.",
          hi: "अगले 24-48 घंटों की बारिश संभावना के अनुसार सिंचाई योजना बनाएं।",
        },
        spray_advice: {
          en: "Avoid spraying when wind is high or rainfall probability is above 60%.",
          hi: "तेज हवा या 60% से अधिक वर्षा संभावना में छिड़काव से बचें।",
        },
      };
    }
    case "getMandiPrices": {
      const crop = payload.crop || "Wheat";
      const state = payload.state || "India";
      const district = payload.district || "";
      const prices = buildMandiRows(crop, state, district);
      const best = prices[0];
      const weeklyDirection = prices.filter((p) => p.trend === "up").length >= 3 ? "up" : "down";
      return {
        crop_name: crop,
        crop_name_hi: crop,
        price_date: toDateKey(new Date()),
        prices,
        best_mandi: {
          name: best.mandi,
          price: best.modal_price,
          reason_en: "Highest modal price among tracked mandis.",
          reason_hi: "ट्रैक की गई मंडियों में सबसे अधिक मॉडल भाव।",
        },
        market_advice: {
          en: "Compare transport cost before choosing the top-price mandi.",
          hi: "सर्वोच्च भाव वाली मंडी चुनने से पहले परिवहन लागत की तुलना करें।",
        },
        weekly_trend: {
          direction: weeklyDirection,
          percentage: weeklyDirection === "up" ? 3.6 : -2.4,
          analysis_en:
            weeklyDirection === "up"
              ? "Demand remains strong this week."
              : "Prices softened due to higher arrivals.",
          analysis_hi:
            weeklyDirection === "up"
              ? "इस सप्ताह मांग मजबूत बनी हुई है।"
              : "आवक बढ़ने से कीमतों में नरमी आई है।",
        },
      };
    }
    case "getGovtSchemes": {
      const allSchemes = buildSchemeRows(payload.state || "");
      const type = (payload.scheme_type || "").toLowerCase();
      const filtered = type ? allSchemes.filter((s) => s.type.includes(type)) : allSchemes;
      return {
        schemes: filtered,
        kisan_helpline: "1800-180-1551",
        important_notice: {
          en: "Verify deadlines on official portals before submission.",
          hi: "आवेदन जमा करने से पहले आधिकारिक पोर्टल पर अंतिम तिथियां सत्यापित करें।",
        },
      };
    }
    case "getCropCalendar": {
      return buildCropCalendar(payload.crop, payload.month);
    }
    case "predictRenewableEnergy": {
      return buildRenewableEnergy(
        payload.location || "Local Area",
        payload.state || "State",
        Number(payload.farm_area_acres || 5),
      );
    }
    case "diagnoseCropDisease": {
      return buildDiagnosis(payload.crop_name, payload.symptoms);
    }
    case "checkAlerts": {
      const now = new Date().toISOString();
      const notifications = [
        {
          id: crypto.randomUUID(),
          type: "weather_alert",
          severity: "medium",
          title_en: "Rain advisory",
          title_hi: "बारिश सलाह",
          message_en: "Possible rainfall in next 24 hours. Avoid pesticide spray.",
          message_hi: "अगले 24 घंटे में बारिश की संभावना। कीटनाशक छिड़काव टालें।",
          is_read: false,
          created_date: now,
        },
      ];
      return {
        notifications_created: notifications.length,
        notifications,
      };
    }
    default:
      return {};
  }
}

export async function runMockInvokeLLM(payload: AnyRecord = {}) {
  const prompt = String(payload.prompt || "");
  const hasRecommendationSchema =
    Boolean(payload.response_json_schema?.properties?.recommendations) ||
    prompt.toLowerCase().includes("nutrient") ||
    prompt.toLowerCase().includes("npk");

  if (hasRecommendationSchema) {
    return buildNutrientRecommendations(prompt);
  }

  return {
    message_en: "LLM endpoint is not configured. Set VITE_API_BASE_URL to connect your AI backend.",
    message_hi: "LLM एंडपॉइंट कॉन्फ़िगर नहीं है। अपने AI बैकएंड के लिए VITE_API_BASE_URL सेट करें।",
  };
}
