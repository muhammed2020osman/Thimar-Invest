'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized investment recommendations.
 *
 * - getInvestmentRecommendations - A function that takes user preferences and market trends as input and returns a list of investment recommendations.
 * - InvestmentRecommendationInput - The input type for the getInvestmentRecommendations function.
 * - InvestmentRecommendationOutput - The return type for the getInvestmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentRecommendationInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The investment preferences of the user, including risk tolerance and investment goals.'),
  marketTrends: z
    .string()
    .describe('The current market trends and conditions.'),
});
export type InvestmentRecommendationInput = z.infer<typeof InvestmentRecommendationInputSchema>;

const InvestmentRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      opportunityName: z.string().describe('The name of the investment opportunity.'),
      assetType: z.string().describe('The type of asset (e.g., residential, commercial).'),
      city: z.string().describe('The city where the investment is located.'),
      expectedReturn: z.number().describe('The expected return on investment.'),
      riskLevel: z.string().describe('The risk level associated with the investment (e.g., low, medium, high).'),
      justification: z.string().describe('The reasoning behind the recommendation based on user preferences and market trends.'),
    })
  ).describe('A list of investment recommendations tailored to the user.'),
});
export type InvestmentRecommendationOutput = z.infer<typeof InvestmentRecommendationOutputSchema>;

export async function getInvestmentRecommendations(input: InvestmentRecommendationInput): Promise<InvestmentRecommendationOutput> {
  return investmentRecommendationFlow(input);
}

const investmentRecommendationPrompt = ai.definePrompt({
  name: 'investmentRecommendationPrompt',
  input: {schema: InvestmentRecommendationInputSchema},
  output: {schema: InvestmentRecommendationOutputSchema},
  prompt: `You are an expert investment advisor. Based on the user's preferences and current market trends, provide personalized investment recommendations.

User Preferences: {{{userPreferences}}}
Market Trends: {{{marketTrends}}}

Provide a list of investment opportunities tailored to the user. Include the opportunity name, asset type, city, expected return, risk level, and a brief justification for each recommendation.`, 
});

const investmentRecommendationFlow = ai.defineFlow(
  {
    name: 'investmentRecommendationFlow',
    inputSchema: InvestmentRecommendationInputSchema,
    outputSchema: InvestmentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await investmentRecommendationPrompt(input);
    return output!;
  }
);
