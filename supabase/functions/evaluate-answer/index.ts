import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { question, answer, category } = await req.json();

    console.log('Evaluating answer for question:', question);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert interviewer evaluating candidate responses. Analyze the answer and provide:
1. A score from 0-100
2. Whether the answer is acceptable (true/false)
3. Brief constructive feedback (2-3 sentences)

Respond in JSON format: {"score": number, "is_correct": boolean, "feedback": "string"}`
          },
          {
            role: 'user',
            content: `Question (${category}): ${question}\n\nCandidate's Answer: ${answer}\n\nPlease evaluate this answer.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI evaluation failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI raw response:', aiResponse);

    // Parse the AI response
    let evaluation;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if AI doesn't return JSON
        evaluation = {
          score: 70,
          is_correct: true,
          feedback: aiResponse
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      evaluation = {
        score: 70,
        is_correct: true,
        feedback: aiResponse
      };
    }

    console.log('Evaluation completed:', evaluation);

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Evaluation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
