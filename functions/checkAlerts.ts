import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { profile_id, check_type } = body;

        // Get farmer profile
        const profiles = await base44.entities.FarmerProfile.filter({ id: profile_id });
        if (profiles.length === 0) {
            return Response.json({ error: 'Profile not found' }, { status: 404 });
        }

        const profile = profiles[0];
        const prefs = profile.notification_preferences || {};
        const notifications = [];

        // Check weather alerts
        if ((check_type === 'all' || check_type === 'weather') && prefs.weather_alerts !== false) {
            const weatherResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Check for critical weather alerts in ${profile.location}, ${profile.state}, India for the next 24-48 hours.
                
Look for:
- Heavy rainfall (>50mm)
- Frost/cold wave
- Heat wave
- Strong winds (>50 km/h)
- Hailstorm
- Cyclone warnings

Return ONLY if there are actual critical alerts. Return empty array if weather is normal.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        alerts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    severity: { type: "string", enum: ["medium", "high", "critical"] },
                                    title_en: { type: "string" },
                                    title_hi: { type: "string" },
                                    message_en: { type: "string" },
                                    message_hi: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            if (weatherResponse?.alerts) {
                for (const alert of weatherResponse.alerts) {
                    notifications.push({
                        type: 'weather_alert',
                        ...alert
                    });
                }
            }
        }

        // Check price alerts for favorite mandis
        if ((check_type === 'all' || check_type === 'price') && prefs.price_alerts !== false && profile.favorite_mandis?.length > 0) {
            const threshold = prefs.price_threshold_percent || 5;
            
            for (const crop of profile.crops?.slice(0, 2) || []) {
                const priceResponse = await base44.integrations.Core.InvokeLLM({
                    prompt: `Check current mandi prices for ${crop} in ${profile.state}, India.
                    
Focus on these mandis if possible: ${profile.favorite_mandis.join(', ')}

Look for significant price changes (>${threshold}% increase or decrease) compared to yesterday or last week.
Return only if there are significant price movements.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            price_alerts: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        mandi: { type: "string" },
                                        crop: { type: "string" },
                                        change_percent: { type: "number" },
                                        direction: { type: "string", enum: ["up", "down"] },
                                        current_price: { type: "number" },
                                        title_en: { type: "string" },
                                        title_hi: { type: "string" },
                                        message_en: { type: "string" },
                                        message_hi: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                });

                if (priceResponse?.price_alerts) {
                    for (const alert of priceResponse.price_alerts) {
                        if (Math.abs(alert.change_percent) >= threshold) {
                            notifications.push({
                                type: 'price_alert',
                                severity: Math.abs(alert.change_percent) >= 10 ? 'high' : 'medium',
                                ...alert,
                                related_data: { mandi: alert.mandi, crop: alert.crop, price: alert.current_price }
                            });
                        }
                    }
                }
            }
        }

        // Check scheme updates
        if ((check_type === 'all' || check_type === 'scheme') && prefs.scheme_updates !== false && profile.favorite_schemes?.length > 0) {
            const schemeResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Check for any recent updates or announcements about these government agricultural schemes in ${profile.state}: ${profile.favorite_schemes.join(', ')}

Look for:
- New deadlines
- Policy changes
- Subsidy amount changes
- New eligibility criteria

Return only if there are actual recent updates (within last week).`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        scheme_updates: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scheme_name: { type: "string" },
                                    update_type: { type: "string" },
                                    title_en: { type: "string" },
                                    title_hi: { type: "string" },
                                    message_en: { type: "string" },
                                    message_hi: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            if (schemeResponse?.scheme_updates) {
                for (const update of schemeResponse.scheme_updates) {
                    notifications.push({
                        type: 'scheme_update',
                        severity: 'medium',
                        ...update,
                        related_data: { scheme: update.scheme_name }
                    });
                }
            }
        }

        // Create notifications in database
        if (notifications.length > 0) {
            await base44.entities.FarmerNotification.bulkCreate(notifications);
        }

        return Response.json({ 
            success: true, 
            notifications_created: notifications.length,
            notifications 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});