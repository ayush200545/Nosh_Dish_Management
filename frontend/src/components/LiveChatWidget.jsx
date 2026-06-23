import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { WS_BASE_URL } from '../config';
import { useUser } from '../hooks/useUserHook';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const { user } = useUser();
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !ws.current) {
      ws.current = new WebSocket(`${WS_BASE_URL}/api/v1/ws/chat`);
      
      ws.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'CHAT_MESSAGE') {
            setMessages(prev => [...prev, msg]);
          }
        } catch (e) {}
      };
    }

    return () => {
      // don't close on every render if we want to keep it alive
    };
  }, [isOpen]);

  // Keep WS connection alive even if closed? No, let's close it if component unmounts
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !ws.current) return;

    const payload = {
      sender: user?.name || 'Anonymous User',
      text: inputText
    };

    ws.current.send(JSON.stringify(payload));
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-brand-purple text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-bold">Live Support</h3>
              <p className="text-xs text-brand-purple-100">We typically reply instantly</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 custom-scrollbar">
            <div className="text-center text-xs text-slate-400 mb-2">Chat started</div>
            {messages.map((msg, idx) => {
              const isMe = msg.sender === (user?.name || 'Anonymous User');
              const isAdmin = msg.sender === 'Admin';
              
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] text-slate-400 ml-1 mb-0.5">{msg.sender}</span>}
                  <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                    isMe 
                      ? 'bg-brand-purple text-white rounded-br-sm' 
                      : isAdmin 
                        ? 'bg-slate-800 text-white rounded-bl-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-brand-purple hover:bg-[#4435cc] disabled:bg-slate-200 disabled:text-slate-400 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-purple hover:bg-[#4435cc] text-white w-14 h-14 rounded-full shadow-lg shadow-brand-purple/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
