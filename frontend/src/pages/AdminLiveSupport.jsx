import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { WS_BASE_URL } from '../config';

export default function AdminLiveSupport() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_BASE_URL}/api/v1/ws/chat`);
    
    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'CHAT_MESSAGE') {
          setMessages(prev => [...prev, msg]);
        }
      } catch (e) {}
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !ws.current) return;

    const payload = {
      sender: 'Admin',
      text: inputText
    };

    ws.current.send(JSON.stringify(payload));
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Live Customer Support</h1>
        <p className="text-slate-500 text-sm mt-1">Chat directly with active users on the platform.</p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="font-semibold text-slate-700">Global Chat Channel</h2>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
              No messages yet. Waiting for users to connect...
            </div>
          )}
          {messages.map((msg, idx) => {
            const isAdmin = msg.sender === 'Admin';
            
            return (
              <div key={idx} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-brand-purple text-white' : 'bg-blue-100 text-blue-600'}`}>
                  {isAdmin ? 'A' : <User className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-700">{msg.sender}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    isAdmin 
                      ? 'bg-brand-purple text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response to users..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-brand-purple hover:bg-[#4435cc] disabled:bg-slate-300 disabled:text-slate-500 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
