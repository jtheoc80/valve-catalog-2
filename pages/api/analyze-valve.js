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

    // Image validation: Check format and size
    if (!image || (!image.startsWith('data:image/jpeg') && !image.startsWith('data:image/png'))) {
      return res.status(400).json({ message: 'Invalid image format. Only JPEG and PNG are supported.' });
    }

    const base64Image = image.split(',')[1] || image;
    const imageSize = (base64Image.length * 3) / 4 / 1024 / 1024; // Convert to MB
    if (imageSize > 5) {
      return res.status(400).json({ message: 'Image size exceeds 5MB. Please upload a smaller image.' });
    }

    // Prepare and send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a valve identification expert. Analyze this valve image and provide detailed specifications. Include size, material type, brand if visible, and any notable features. Format the response as a JSON object with these fields: size, material, brand, partNumber, specifications (including pressureRating, temperature, connection, stemType), and features array."
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

    // Parse OpenAI response with dynamic confidence scoring
    try {
      const analysisText = response.choices[0].message.content;
      const analysisJson = JSON.parse(analysisText);
      const confidenceScore = response.choices[0].finish_reason === "stop" ? 95 : 85;

      const result = {
        ...analysisJson,
        confidence: confidenceScore,
        specifications: {
          pressureRating: analysisJson.specifications?.pressureRating || 'Unknown',
          temperature: analysisJson.specifications?.temperature || 'Unknown',
          connection: analysisJson.specifications?.connection || 'Unknown',
          stemType: analysisJson.specifications?.stemType || 'Unknown',
          ...analysisJson.specifications,
        },
        features: analysisJson.features || []
      };

      return res.status(200).json(result);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return res.status(200).json({
        size: "Unable to determine",
        material: "Analysis incomplete",
        brand: "Unknown",
        partNumber: "N/A",
        confidence: 0,
        specifications: {
          pressureRating: "Unknown",
          temperature: "Unknown",
          connection: "Unknown",
          stemType: "Unknown"
        },
        features: ["Analysis incomplete"]
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);

    let errorMessage = 'Error analyzing image';
    if (error.message.includes('401')) {
      errorMessage = 'Authentication error: Invalid OpenAI API key.';
    } else if (error.message.includes('429')) {
      errorMessage = 'Rate limit exceeded: Too many requests to OpenAI API.';
    } else if (error.message.includes('500')) {
      errorMessage = 'OpenAI server error: Please try again later.';
    }

    return res.status(500).json({
      message: errorMessage,
      error: error.message,
    });
  }
}
