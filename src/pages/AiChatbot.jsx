import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AiChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hi! I'm TutorBot — your math companion. Ask me anything or say 'quiz me on algebra' to start!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch previous chat history (optional: skip if you don't have it yet)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/ai/chatbot/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.history) {
          setMessages([{ sender: 'bot', text: "👋 Welcome back! Here's our previous chat." }, ...res.data.history]);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  const speak = (text) => {
    if (!speakEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/ai/chatbot', {
        message: input,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const botText = res.data.response;
      const botMsg = { sender: 'bot', text: botText };
      setMessages(prev => [...prev, botMsg]);
      speak(botText);
    } catch (err) {
      console.error(err);
      const errMsg = { sender: 'bot', text: "⚠️ Oops! Something went wrong. Try again later." };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-black bg-opacity-40 p-4 rounded-xl max-h-[500px] overflow-y-auto flex flex-col">
      <div className="flex justify-between mb-3">
        <span className="text-sm text-slate-300">Type a question or ask for a quiz.</span>
        <button
          onClick={() => setSpeakEnabled(!speakEnabled)}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
        >
          {speakEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white self-end' : 'bg-white bg-opacity-10 text-slate-200 self-start'}`}
          >
            <p>{msg.text}</p>
            <span className="text-xs block mt-1 opacity-60">{msg.sender === 'user' ? 'You' : 'TutorBot 🤖'}</span>
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 italic text-sm animate-pulse">TutorBot is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2">
        <textarea
          className="flex-1 p-2 rounded-lg bg-slate-800 text-white resize-none focus:outline-none"
          rows="2"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiChatbot;


