import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { state, scheme_type, crop } = await req.json();
        
        const stateFilter = state ? `in ${state}` : 'across India';
        const typeFilter = scheme_type ? `specifically for ${scheme_type}` : '';
        const cropFilter = crop ? `related to ${crop} farming` : '';

        // Use InvokeLLM with internet context to get scheme information
        const schemes = await base44.integrations.Core.InvokeLLM({
            prompt: `Find current government agricultural schemes and subsidies for farmers ${stateFilter} ${typeFilter} ${cropFilter}.
            
            Search for latest information from official government sources about:
            - PM-KISAN and other direct benefit schemes
            - Crop insurance schemes (PMFBY)
            - Subsidies on seeds, fertilizers, equipment
            - KCC (Kisan Credit Card) and agricultural loans
            - Solar pump subsidies
            - Drip irrigation subsidies
            - State-specific schemes
            
            For each scheme provide:
            - Scheme name
            - Benefits
            - Eligibility criteria
            - How to apply
            - Required documents
            - Important deadlines
            - Helpline numbers
            
            Provide response in both Hindi and English.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    schemes: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name_en: { type: "string" },
                                name_hi: { type: "string" },
                                category: { type: "string" },
                                benefits_en: { type: "string" },
                                benefits_hi: { type: "string" },
                                eligibility_en: { type: "array", items: { type: "string" } },
                                eligibility_hi: { type: "array", items: { type: "string" } },
                                subsidy_amount: { type: "string" },
                                documents_required: { type: "array", items: { type: "string" } },
                                how_to_apply_en: { type: "string" },
                                how_to_apply_hi: { type: "string" },
                                deadline: { type: "string" },
                                website: { type: "string" },
                                helpline: { type: "string" }
                            }
                        }
                    },
                    kisan_helpline: { type: "string" },
                    important_notice: {
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
            data: schemes 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});