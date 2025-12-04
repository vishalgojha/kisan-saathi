import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { image_url, crop_name, symptoms } = await req.json();
        
        if (!image_url && !symptoms) {
            return Response.json({ 
                error: 'Either image_url or symptoms description is required' 
            }, { status: 400 });
        }

        const cropContext = crop_name ? `for ${crop_name} crop` : '';
        const symptomsContext = symptoms ? `Additional symptoms described: ${symptoms}` : '';

        // Use InvokeLLM with image analysis
        const diagnosis = await base44.integrations.Core.InvokeLLM({
            prompt: `You are an expert agricultural scientist and plant pathologist. Analyze this crop image ${cropContext} and provide detailed diagnosis.
            
            ${symptomsContext}
            
            Provide comprehensive analysis including:
            1. Disease/Pest/Deficiency identification
            2. Cause and spread mechanism
            3. Severity assessment
            4. Organic treatments (neem, biological agents, home remedies)
            5. Chemical treatments with EXACT dosages
            6. Prevention measures
            7. Emergency actions if severe
            
            Be specific with product names, dosages (ml/gram per liter), application timing, and safety precautions.
            Provide response in both Hindi and English.`,
            file_urls: image_url ? [image_url] : undefined,
            response_json_schema: {
                type: "object",
                properties: {
                    diagnosis: {
                        type: "object",
                        properties: {
                            problem_name_en: { type: "string" },
                            problem_name_hi: { type: "string" },
                            problem_type: { type: "string" },
                            cause_en: { type: "string" },
                            cause_hi: { type: "string" },
                            severity: { type: "string" },
                            spread_risk: { type: "string" }
                        }
                    },
                    organic_treatments: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name_en: { type: "string" },
                                name_hi: { type: "string" },
                                ingredients: { type: "string" },
                                dosage: { type: "string" },
                                application_en: { type: "string" },
                                application_hi: { type: "string" },
                                frequency: { type: "string" }
                            }
                        }
                    },
                    chemical_treatments: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                product_name: { type: "string" },
                                active_ingredient: { type: "string" },
                                dosage_per_liter: { type: "string" },
                                dosage_per_acre: { type: "string" },
                                application_method_en: { type: "string" },
                                application_method_hi: { type: "string" },
                                best_time: { type: "string" },
                                safety_interval_days: { type: "number" },
                                precautions_en: { type: "string" },
                                precautions_hi: { type: "string" }
                            }
                        }
                    },
                    prevention: {
                        type: "object",
                        properties: {
                            measures_en: { type: "array", items: { type: "string" } },
                            measures_hi: { type: "array", items: { type: "string" } }
                        }
                    },
                    emergency_action: {
                        type: "object",
                        properties: {
                            needed: { type: "boolean" },
                            action_en: { type: "string" },
                            action_hi: { type: "string" }
                        }
                    },
                    additional_advice: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            hi: { type: "string" }
                        }
                    }
                }
            }
        });

        // Store the query for analytics
        await base44.asServiceRole.entities.FarmerQuery.create({
            query_type: 'crop_disease',
            crop_name: crop_name || 'unknown',
            query_text: symptoms || 'Image analysis',
            image_url: image_url,
            diagnosis_result: diagnosis,
            response_summary: diagnosis.diagnosis?.problem_name_en || 'Analysis complete',
            status: 'resolved'
        });

        return Response.json({ 
            success: true, 
            data: diagnosis 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});