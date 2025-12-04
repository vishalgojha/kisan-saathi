import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { crop, state, district } = await req.json();
        
        if (!crop) {
            return Response.json({ error: 'Crop name is required' }, { status: 400 });
        }

        // Use InvokeLLM with internet context to get mandi prices
        const locationFilter = district ? `${district}, ${state || 'India'}` : (state || 'major mandis across India');
        
        const priceData = await base44.integrations.Core.InvokeLLM({
            prompt: `Find current mandi prices for ${crop} in ${locationFilter}. 
            Search for today's or most recent agricultural market prices from government sources like agmarknet.gov.in or similar.
            Include:
            - Prices from multiple mandis if available
            - Min, max and modal (average) prices in Rs per Quintal
            - Price trend compared to last week
            - Best mandi to sell based on price
            - Market advice for the farmer
            
            Provide response in both Hindi and English.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    crop_name: { type: "string" },
                    crop_name_hi: { type: "string" },
                    price_date: { type: "string" },
                    prices: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                mandi: { type: "string" },
                                district: { type: "string" },
                                state: { type: "string" },
                                min_price: { type: "number" },
                                max_price: { type: "number" },
                                modal_price: { type: "number" },
                                trend: { type: "string" }
                            }
                        }
                    },
                    best_mandi: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            price: { type: "number" },
                            reason_en: { type: "string" },
                            reason_hi: { type: "string" }
                        }
                    },
                    market_advice: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    },
                    weekly_trend: {
                        type: "object",
                        properties: {
                            direction: { type: "string" },
                            percentage: { type: "number" },
                            analysis_en: { type: "string" },
                            analysis_hi: { type: "string" }
                        }
                    }
                }
            }
        });

        // Store price data for analytics
        if (priceData.prices && priceData.prices.length > 0) {
            const priceRecords = priceData.prices.map(p => ({
                crop_name: crop,
                mandi_name: p.mandi,
                district: p.district,
                state: p.state,
                min_price: p.min_price,
                max_price: p.max_price,
                modal_price: p.modal_price,
                price_date: priceData.price_date,
                price_trend: p.trend
            }));
            
            await base44.asServiceRole.entities.MandiPrice.bulkCreate(priceRecords);
        }

        return Response.json({ 
            success: true, 
            data: priceData 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});