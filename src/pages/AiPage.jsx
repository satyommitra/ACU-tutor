import React, { useState } from 'react';
import axios from 'axios';

const AiPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai', { prompt: question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Ask the AI Tutor</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows="4"
        placeholder="Ask your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AiPage;