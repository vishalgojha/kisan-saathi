import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { location, state, farm_area_acres } = await req.json();
        
        if (!location || !state) {
            return Response.json({ 
                error: 'Location and state are required' 
            }, { status: 400 });
        }

        // Get predictions using LLM with internet context
        const predictions = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyze renewable energy potential for a farm in ${location}, ${state}, India.
            
            Farm area: ${farm_area_acres || 5} acres
            
            Provide detailed predictions for:
            1. Solar energy potential (kWh per day, monthly, yearly)
            2. Wind energy potential based on regional wind patterns
            3. Optimal panel/turbine placement recommendations
            4. Cost-benefit analysis for installation
            5. Payback period estimates
            6. Seasonal variations in output
            7. Government subsidies available in ${state}
            
            Use current weather patterns, geographical data, and solar irradiance data for ${state}.
            Provide practical recommendations for Indian farmers.
            Include both Hindi and English responses.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    solar_potential: {
                        type: "object",
                        properties: {
                            daily_kwh: { type: "number" },
                            monthly_kwh: { type: "number" },
                            yearly_kwh: { type: "number" },
                            peak_sun_hours: { type: "number" },
                            recommended_capacity_kw: { type: "number" },
                            panel_area_required_sqm: { type: "number" }
                        }
                    },
                    wind_potential: {
                        type: "object",
                        properties: {
                            avg_wind_speed_mps: { type: "number" },
                            feasibility: { type: "string" },
                            daily_kwh: { type: "number" },
                            monthly_kwh: { type: "number" },
                            yearly_kwh: { type: "number" },
                            recommended_turbine_size_kw: { type: "number" },
                            height_required_meters: { type: "number" }
                        }
                    },
                    cost_analysis: {
                        type: "object",
                        properties: {
                            solar_installation_cost_inr: { type: "number" },
                            wind_installation_cost_inr: { type: "number" },
                            monthly_savings_inr: { type: "number" },
                            payback_period_years: { type: "number" },
                            govt_subsidy_available_inr: { type: "number" }
                        }
                    },
                    seasonal_output: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                season: { type: "string" },
                                solar_efficiency_percent: { type: "number" },
                                wind_efficiency_percent: { type: "number" }
                            }
                        }
                    },
                    recommendations: {
                        type: "object",
                        properties: {
                            solar_placement_en: { type: "string" },
                            solar_placement_hi: { type: "string" },
                            wind_placement_en: { type: "string" },
                            wind_placement_hi: { type: "string" },
                            best_option_en: { type: "string" },
                            best_option_hi: { type: "string" },
                            additional_tips_en: { type: "array", items: { type: "string" } },
                            additional_tips_hi: { type: "array", items: { type: "string" } }
                        }
                    },
                    subsidies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                scheme_name_en: { type: "string" },
                                scheme_name_hi: { type: "string" },
                                subsidy_percent: { type: "number" },
                                max_amount_inr: { type: "number" }
                            }
                        }
                    }
                }
            }
        });

        return Response.json({ 
            success: true, 
            data: predictions 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});