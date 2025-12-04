import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { crop, state, month } = await req.json();
        
        const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long' });
        const stateContext = state ? `in ${state}` : 'in North India';
        const cropContext = crop ? `for ${crop}` : 'for major crops';

        // Use InvokeLLM to get crop calendar
        const calendar = await base44.integrations.Core.InvokeLLM({
            prompt: `Provide agricultural calendar and activities ${cropContext} ${stateContext} for ${currentMonth} and next 2 months.
            
            Include:
            1. Crops suitable for sowing this month
            2. Current crops needing attention
            3. Fertilizer schedule
            4. Irrigation requirements
            5. Common pests/diseases to watch out for
            6. Harvesting schedule
            7. Market timing advice
            8. Preparation for next season
            
            Be specific to Indian agricultural practices and local varieties.
            Provide response in both Hindi and English.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    current_month: { type: "string" },
                    region: { type: "string" },
                    season: { type: "string" },
                    sowing_crops: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                crop_en: { type: "string" },
                                crop_hi: { type: "string" },
                                variety: { type: "string" },
                                sowing_period: { type: "string" },
                                seed_rate: { type: "string" },
                                spacing: { type: "string" }
                            }
                        }
                    },
                    ongoing_activities: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                crop_en: { type: "string" },
                                crop_hi: { type: "string" },
                                activity_en: { type: "string" },
                                activity_hi: { type: "string" },
                                timing: { type: "string" }
                            }
                        }
                    },
                    fertilizer_schedule: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                crop: { type: "string" },
                                fertilizer: { type: "string" },
                                dosage: { type: "string" },
                                application_week: { type: "string" }
                            }
                        }
                    },
                    pest_alerts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                crop: { type: "string" },
                                pest_en: { type: "string" },
                                pest_hi: { type: "string" },
                                prevention_en: { type: "string" },
                                prevention_hi: { type: "string" }
                            }
                        }
                    },
                    harvest_schedule: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                crop_en: { type: "string" },
                                crop_hi: { type: "string" },
                                harvest_period: { type: "string" },
                                tips_en: { type: "string" },
                                tips_hi: { type: "string" }
                            }
                        }
                    },
                    market_advice: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    },
                    weather_tips: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    }
                }
            }
        });

        return Response.json({ 
            success: true, 
            data: calendar 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});