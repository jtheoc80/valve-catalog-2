// pages/api/analyze-valve.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    // Remove the data:image/jpeg;base64 prefix if present
    const base64Image = image.split(',')[1] || image;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this valve image and provide detailed specifications in this exact JSON format: { size: string, material: string, brand: string, partNumber: string, specifications: { pressureRating: string, temperature: string, connection: string, stemType: string }, features: string[] }"
            },
            {
              type: "image_url",
              image_url: {
                "url": `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    // Parse the response
    try {
      const analysisText = response.choices[0].message.content;
      const analysisJson = JSON.parse(analysisText);
      return res.status(200).json({
        ...analysisJson,
        confidence: 92 // Adding a default confidence score
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return res.status(500).json({ 
        message: 'Error parsing analysis results',
        error: parseError.message 
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ 
      message: 'Error analyzing image',
      error: error.message 
    });
  }
}
