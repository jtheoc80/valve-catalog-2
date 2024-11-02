// pages/api/vision-analyze.js

import vision from '@google-cloud/vision';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Initialize the Google Vision client with the credentials JSON
    const client = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON),
    });

    const { image } = req.body;

    // Validate image input
    if (!image || (!image.startsWith('data:image/jpeg') && !image.startsWith('data:image/png'))) {
      return res.status(400).json({ message: 'Invalid image format. Only JPEG and PNG are supported.' });
    }

    const base64Image = image.split(',')[1];
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Perform text detection (OCR) and label detection on the image
    const [result] = await client.annotateImage({
      image: { content: imageBuffer },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'TEXT_DETECTION' },
        { type: 'LOGO_DETECTION', maxResults: 5 },
      ],
    });

    const labels = result.labelAnnotations?.map(label => label.description) || [];
    const text = result.textAnnotations?.[0]?.description || 'No text found';
    const logos = result.logoAnnotations?.map(logo => logo.description) || [];

    res.status(200).json({
      labels,
      text,
      logos,
      message: 'Image analyzed successfully',
    });
  } catch (error) {
    console.error('Google Vision API error:', error);
    res.status(500).json({
      message: 'Error analyzing image',
      error: error.message,
    });
  }
}
