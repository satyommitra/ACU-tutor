import axios from 'axios';

export const callHuggingFaceModel = async (model, inputText) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  console.log('Using Hugging Face API Key:', process.env.HUGGINGFACE_API_TOKEN ? '✅ Loaded' : '❌ MISSING');



  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: inputText },
      {
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,

        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Hugging Face API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch AI response: ${error.response?.data?.error || error.message}`);
  }
};


