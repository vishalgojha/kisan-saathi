const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

Deno.serve(async (req) => {
  try {
    const { location, state, farm_area_acres = 5 } = await req.json();

    if (!location || !state) {
      return Response.json({ error: "Location and state are required" }, { status: 400 });
    }

    const area = Math.max(1, Number(farm_area_acres || 5));
    const dailySolar = Number((area * 4.6).toFixed(2));
    const dailyWind = Number((area * 1.4).toFixed(2));
    const monthlySavings = Number(((dailySolar + dailyWind) * 30 * 7).toFixed(2));
    const solarCost = Math.round(area * 50000);
    const subsidy = Math.round(solarCost * 0.3);
    const paybackYears = Number(((solarCost - subsidy) / (monthlySavings * 12)).toFixed(1));

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

    const data = {
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
        feasibility: "Feasible",
        daily_kwh: dailyWind,
        monthly_kwh: Number((dailyWind * 30).toFixed(2)),
        yearly_kwh: Number((dailyWind * 365).toFixed(2)),
        recommended_turbine_size_kw: 3,
        height_required_meters: 12,
      },
      cost_analysis: {
        solar_installation_cost_inr: solarCost,
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
        wind_placement_en: "Place turbines on open boundaries away from trees and shade.",
        wind_placement_hi: "टर्बाइन खुले खेत किनारों पर पेड़ों और छाया से दूर लगाएं।",
        best_option_en: "Hybrid solar + efficient pump combination gives best returns.",
        best_option_hi: "सोलर + कुशल पंप का संयोजन बेहतर रिटर्न देता है।",
        additional_tips_en: ["Clean solar panels every 10-15 days.", "Use net metering if available."],
        additional_tips_hi: ["हर 10-15 दिन में पैनल साफ करें।", "उपलब्ध हो तो नेट मीटरिंग अपनाएं।"],
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

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
