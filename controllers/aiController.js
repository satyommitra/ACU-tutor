import { callHuggingFaceModel } from '../utils/huggingFaceClient.js';

export const explainTopic = async (req, res) => {
  console.log('REQ.BODY:', req.body); // Debug log

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await callHuggingFaceModel('google/flan-t5-base', prompt);

    // Hugging Face returns an array of objects
    const output = response[0]?.generated_text || 'No output from model';
    
    res.json({ result: output });
  } catch (error) {
    console.error('Error in explainTopic:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response.' });
  }
};


