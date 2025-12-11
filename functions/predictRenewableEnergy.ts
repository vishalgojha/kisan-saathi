import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { location, state, farm_area_acres, lat, lon, crop_type } = await req.json();
        
        if (!location || !state) {
            return Response.json({ 
                error: 'Location and state are required' 
            }, { status: 400 });
        }

        // Fetch weather data from Open-Meteo API (free, no key needed)
        const weatherLat = lat || 28.6139; // Default to Delhi if not provided
        const weatherLon = lon || 77.2090;
        
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${weatherLat}&longitude=${weatherLon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunshine_duration&timezone=Asia/Kolkata&forecast_days=7`
        );
        const weatherData = await weatherResponse.json();

        // Calculate solar potential using regression model
        const avgSunHours = weatherData.daily.sunshine_duration.reduce((a, b) => a + b, 0) / weatherData.daily.sunshine_duration.length / 3600; // Convert to hours
        const avgTemp = weatherData.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / weatherData.daily.temperature_2m_max.length;
        const avgWindSpeed = weatherData.daily.windspeed_10m_max.reduce((a, b) => a + b, 0) / weatherData.daily.windspeed_10m_max.length;
        
        // Simple regression model for solar (kWh = panel_efficiency * area * sun_hours * performance_ratio)
        const panelEfficiency = 0.18; // 18% efficiency
        const performanceRatio = 0.75; // 75% after losses
        const recommendedCapacityKw = farm_area_acres * 0.5; // 0.5 kW per acre
        const panelAreaSqm = recommendedCapacityKw * 5.5; // ~5.5 sqm per kW
        
        const dailySolarKwh = panelAreaSqm * avgSunHours * panelEfficiency * performanceRatio;
        const monthlySolarKwh = dailySolarKwh * 30;
        const yearlySolarKwh = dailySolarKwh * 365;
        
        // Wind energy regression (kWh = 0.5 * air_density * swept_area * wind_speed^3 * efficiency)
        const airDensity = 1.225; // kg/m³
        const turbineEfficiency = 0.35;
        const rotorDiameter = avgWindSpeed > 4 ? 5 : 3; // meters, based on wind speed
        const sweptArea = Math.PI * Math.pow(rotorDiameter / 2, 2);
        
        const dailyWindKwh = avgWindSpeed > 3 ? 
            0.5 * airDensity * sweptArea * Math.pow(avgWindSpeed, 3) * turbineEfficiency * 24 / 1000 : 0;
        const monthlyWindKwh = dailyWindKwh * 30;
        const yearlyWindKwh = dailyWindKwh * 365;
        
        // Cost calculations (India-specific)
        const solarCostPerKw = 50000; // ₹50,000 per kW
        const windCostPerKw = 65000; // ₹65,000 per kW
        const electricityRate = 7; // ₹7 per kWh average
        
        const solarInstallationCost = recommendedCapacityKw * solarCostPerKw;
        const windInstallationCost = (dailyWindKwh > 0 ? 5 : 0) * windCostPerKw;
        const monthlySavings = (dailySolarKwh + dailyWindKwh) * 30 * electricityRate;
        const paybackYears = (solarInstallationCost + windInstallationCost) / (monthlySavings * 12);
        
        // Government subsidy (India - 30% subsidy up to 10kW, 20% above)
        const subsidyPercent = recommendedCapacityKw <= 10 ? 30 : 20;
        const govtSubsidy = solarInstallationCost * (subsidyPercent / 100);

        // Generate 7-day trend
        const dailyTrends = weatherData.daily.sunshine_duration.map((sunDuration, idx) => {
            const sunHours = sunDuration / 3600;
            const windSpeed = weatherData.daily.windspeed_10m_max[idx];
            return {
                date: weatherData.daily.time[idx],
                solar_kwh: parseFloat((panelAreaSqm * sunHours * panelEfficiency * performanceRatio).toFixed(2)),
                wind_kwh: windSpeed > 3 ? parseFloat((0.5 * airDensity * sweptArea * Math.pow(windSpeed, 3) * turbineEfficiency * 24 / 1000).toFixed(2)) : 0,
                sun_hours: parseFloat(sunHours.toFixed(1)),
                wind_speed: parseFloat(windSpeed.toFixed(1))
            };
        });

        // Get additional context and recommendations using LLM
        const recommendations = await base44.integrations.Core.InvokeLLM({
            prompt: `Provide renewable energy recommendations for ${crop_type || 'farming'} in ${location}, ${state}, India.
            
            Weather context:
            - Average sun hours: ${avgSunHours.toFixed(1)} hours/day
            - Average temperature: ${avgTemp.toFixed(1)}°C
            - Average wind speed: ${avgWindSpeed.toFixed(1)} m/s
            
            Calculated predictions:
            - Solar: ${dailySolarKwh.toFixed(1)} kWh/day
            - Wind: ${dailyWindKwh.toFixed(1)} kWh/day
            
            Provide practical placement recommendations and tips for Indian farmers.
            Include seasonal variations and government subsidy schemes available in ${state}.
            Respond in both Hindi and English.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
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
            data: {
                solar_potential: {
                    daily_kwh: parseFloat(dailySolarKwh.toFixed(2)),
                    monthly_kwh: parseFloat(monthlySolarKwh.toFixed(2)),
                    yearly_kwh: parseFloat(yearlySolarKwh.toFixed(2)),
                    peak_sun_hours: parseFloat(avgSunHours.toFixed(2)),
                    recommended_capacity_kw: parseFloat(recommendedCapacityKw.toFixed(2)),
                    panel_area_required_sqm: parseFloat(panelAreaSqm.toFixed(2))
                },
                wind_potential: {
                    avg_wind_speed_mps: parseFloat(avgWindSpeed.toFixed(2)),
                    feasibility: avgWindSpeed > 3 ? 'Feasible' : 'Not Feasible',
                    daily_kwh: parseFloat(dailyWindKwh.toFixed(2)),
                    monthly_kwh: parseFloat(monthlyWindKwh.toFixed(2)),
                    yearly_kwh: parseFloat(yearlyWindKwh.toFixed(2)),
                    recommended_turbine_size_kw: avgWindSpeed > 4 ? 5 : 3,
                    height_required_meters: avgWindSpeed > 4 ? 15 : 10
                },
                cost_analysis: {
                    solar_installation_cost_inr: parseFloat(solarInstallationCost.toFixed(2)),
                    wind_installation_cost_inr: parseFloat(windInstallationCost.toFixed(2)),
                    monthly_savings_inr: parseFloat(monthlySavings.toFixed(2)),
                    payback_period_years: parseFloat(paybackYears.toFixed(1)),
                    govt_subsidy_available_inr: parseFloat(govtSubsidy.toFixed(2))
                },
                daily_trends: dailyTrends,
                weather_data: {
                    avg_sun_hours: parseFloat(avgSunHours.toFixed(2)),
                    avg_temp: parseFloat(avgTemp.toFixed(1)),
                    avg_wind_speed: parseFloat(avgWindSpeed.toFixed(2))
                },
                ...recommendations
            }
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});