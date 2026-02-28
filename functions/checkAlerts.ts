Deno.serve(async (req) => {
  try {
    const { profile_id, check_type = "all" } = await req.json();

    if (!profile_id) {
      return Response.json({ error: "profile_id is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const notifications = [];

    if (check_type === "all" || check_type === "weather") {
      notifications.push({
        id: crypto.randomUUID(),
        type: "weather_alert",
        severity: "medium",
        title_en: "Rain advisory",
        title_hi: "बारिश सलाह",
        message_en: "Possible rainfall in next 24 hours. Avoid pesticide spray.",
        message_hi: "अगले 24 घंटे में बारिश की संभावना। कीटनाशक छिड़काव टालें।",
        is_read: false,
        created_date: now,
      });
    }

    if (check_type === "all" || check_type === "price") {
      notifications.push({
        id: crypto.randomUUID(),
        type: "price_alert",
        severity: "low",
        title_en: "Mandi trend update",
        title_hi: "मंडी ट्रेंड अपडेट",
        message_en: "One of your tracked crops has improved prices this week.",
        message_hi: "आपकी ट्रैक की गई एक फसल के भाव इस सप्ताह बेहतर हुए हैं।",
        is_read: false,
        created_date: now,
      });
    }

    return Response.json({
      success: true,
      notifications_created: notifications.length,
      notifications,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
});
