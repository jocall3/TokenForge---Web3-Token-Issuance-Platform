
import { GoogleGenAI, Type } from "@google/genai";

export async function generateTokenomicsModel(prompt: string) {
    // Initializing the AI client with the provided API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Suggestive token name" },
            symbol: { type: Type.STRING, description: "Suggestive token symbol (2-10 uppercase chars)" },
            description: { type: Type.STRING, description: "Detailed token purpose and utility" },
            totalSupply: { type: Type.NUMBER, description: "Total supply of the token" },
            decimals: { type: Type.NUMBER, description: "Number of decimals, typically 18" },
            allocation: {
                type: Type.OBJECT,
                properties: {
                    team: { type: Type.NUMBER, description: "Percentage for team" },
                    investors: { type: Type.NUMBER, description: "Percentage for investors" },
                    ecosystem: { type: Type.NUMBER, description: "Percentage for ecosystem" },
                    treasury: { type: Type.NUMBER, description: "Percentage for treasury" },
                    marketing: { type: Type.NUMBER, description: "Percentage for marketing" },
                    liquidity: { type: Type.NUMBER, description: "Percentage for liquidity" },
                },
                required: ["team", "investors", "ecosystem", "treasury", "marketing", "liquidity"]
            },
            vestingRecommendations: {
                type: Type.OBJECT,
                properties: {
                    team: { type: Type.STRING, description: "Vesting recommendation for team" },
                    investors: { type: Type.STRING, description: "Vesting recommendation for investors" },
                }
            },
            utilitySuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key utility features"
            }
        }
    };

    const fullPrompt = `Generate a detailed tokenomics model in JSON format for this token concept: "${prompt}". Include name, symbol, a detailed description, total supply (realistic number, e.g., 100M-1B), decimals (default 18), and a percentage allocation breakdown. Ensure total allocation sums to 100%.`;

    // Calling the model directly with prompt and config
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    // Access the text property directly from the response
    return JSON.parse(response.text);
}
