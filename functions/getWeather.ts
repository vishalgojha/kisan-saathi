import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { location, days = 3 } = await req.json();
        
        if (!location) {
            return Response.json({ error: 'Location is required' }, { status: 400 });
        }

        // Use InvokeLLM with internet context to get weather data
        const weatherData = await base44.integrations.Core.InvokeLLM({
            prompt: `Get current weather and ${days}-day forecast for ${location}, India. Include:
            - Current temperature, humidity, wind speed
            - Weather condition (sunny, cloudy, rainy, etc.)
            - Rainfall prediction with probability
            - Farming advisory based on weather
            - Best time for irrigation, spraying pesticides
            
            Provide response in both Hindi and English.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    location: { type: "string" },
                    current: {
                        type: "object",
                        properties: {
                            temperature: { type: "number" },
                            humidity: { type: "number" },
                            wind_speed: { type: "number" },
                            condition: { type: "string" },
                            condition_hi: { type: "string" }
                        }
                    },
                    forecast: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                date: { type: "string" },
                                day_name: { type: "string" },
                                day_name_hi: { type: "string" },
                                max_temp: { type: "number" },
                                min_temp: { type: "number" },
                                condition: { type: "string" },
                                condition_hi: { type: "string" },
                                rain_chance: { type: "number" }
                            }
                        }
                    },
                    farming_advisory: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    },
                    irrigation_advice: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    },
                    spray_advice: {
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
            data: weatherData 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});