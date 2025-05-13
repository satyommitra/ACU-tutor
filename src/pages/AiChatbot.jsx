import React, { useState, useEffect, useRef } from 'react';

const AiChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hi! I'm TutorBot — your math companion. Ask me anything or say 'quiz me on algebra' to start!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch previous chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/ai/chatbot/history', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) throw new Error('Failed to fetch history');
        
        const data = await response.json();
        if (data?.history) {
          setMessages([{ sender: 'bot', text: "👋 Welcome back! Here's our previous chat." }, ...data.history]);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
        setError('Could not load chat history');
      }
    };
    fetchHistory();
  }, []);

  const speak = (text) => {
    if (!speakEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const botMsg = { sender: 'bot', text: data.response || "I didn't get that. Can you rephrase?" };
      setMessages(prev => [...prev, botMsg]);
      speak(botMsg.text);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Trying again...');
      // Automatic retry after 2 seconds
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: "⚠️ Connection issue. Please check your network and try again." 
        }]);
      }, 2000);
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
      <div className="flex justify-between mb-3 items-center">
        <span className="text-sm text-slate-300">Type a question or ask for a quiz</span>
        <div className="flex gap-2">
          {error && (
            <span className="text-red-400 text-xs animate-pulse">{error}</span>
          )}
          <button
            onClick={() => setSpeakEnabled(!speakEnabled)}
            className={`text-sm px-3 py-1 rounded transition-all ${
              speakEnabled 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={speakEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {speakEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] transition-all ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white self-end' 
                : 'bg-white bg-opacity-10 text-slate-200 self-start'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            <span className="text-xs block mt-1 opacity-60">
              {msg.sender === 'user' ? 'You' : 'TutorBot 🤖'}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse"></div>
            <span>TutorBot is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2">
        <textarea
          className="flex-1 p-2 rounded-lg bg-slate-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="2"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className={`bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all ${
            loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'
          }`}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AiChatbot;

