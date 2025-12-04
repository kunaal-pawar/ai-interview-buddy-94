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

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert interviewer evaluating candidate responses. Analyze the answer and provide:
1. A score from 0-100
2. Whether the answer is acceptable (true/false)
3. Brief constructive feedback (2-3 sentences)

Question (${category}): ${question}

Candidate's Answer: ${answer}

Please evaluate this answer and respond ONLY in this exact JSON format:
{"score": number, "is_correct": boolean, "feedback": "string"}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini evaluation failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log('Gemini raw response:', aiResponse);

    // Parse the AI response
    let evaluation;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        evaluation = {
          score: 70,
          is_correct: true,
          feedback: aiResponse
        };
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      evaluation = {
        score: 70,
        is_correct: true,
        feedback: aiResponse || 'Unable to parse response'
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
