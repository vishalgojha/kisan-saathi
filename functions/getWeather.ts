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

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const hash = (value: string) =>
  value.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

Deno.serve(async (req) => {
  try {
    const { location, days = 3 } = await req.json();

    if (!location) {
      return Response.json({ error: "Location is required" }, { status: 400 });
    }

    const seed = hash(String(location));
    const forecast = Array.from({ length: clamp(Number(days) || 3, 1, 7) }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const maxTemp = 28 + ((seed + i * 3) % 7) - 3;
      const minTemp = maxTemp - 8;
      const rainChance = clamp(18 + ((seed + i * 11) % 68), 5, 95);
      const condition = rainChance > 55 ? "Rainy" : rainChance > 35 ? "Cloudy" : "Sunny";
      const conditionHi = rainChance > 55 ? "बारिश" : rainChance > 35 ? "बादल" : "धूप";
      return {
        date: toDateKey(date),
        day_name: DAY_NAMES_EN[date.getDay()],
        day_name_hi: DAY_NAMES_HI[date.getDay()],
        max_temp: maxTemp,
        min_temp: minTemp,
        condition,
        condition_hi: conditionHi,
        rain_chance: rainChance,
      };
    });

    const data = {
      location,
      current: {
        temperature: forecast[0].max_temp - 2,
        humidity: clamp(45 + (seed % 40), 30, 90),
        wind_speed: clamp(8 + (seed % 15), 5, 30),
        condition: forecast[0].condition,
        condition_hi: forecast[0].condition_hi,
      },
      forecast,
      farming_advisory: {
        en: "Plan field work in early morning. Monitor fungal pressure when humidity is high.",
        hi: "खेत का काम सुबह करें। अधिक नमी में फफूंद रोगों पर नजर रखें।",
      },
      irrigation_advice: {
        en: "Adjust irrigation based on forecast rain probability over next 48 hours.",
        hi: "अगले 48 घंटे की वर्षा संभावना के अनुसार सिंचाई समायोजित करें।",
      },
      spray_advice: {
        en: "Avoid spraying during strong winds or when rain chance is above 60%.",
        hi: "तेज हवा या 60% से अधिक वर्षा संभावना में छिड़काव न करें।",
      },
    };

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
