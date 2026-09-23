import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { askAIChatbot } from '../services/api';

export const AIChatbot = ({ tripContext }) => {
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('chat_welcome')
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: t('chat_welcome')
      }
    ]);
  }, [currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const newMsgs = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const response = await askAIChatbot(textToSend, tripContext, currentLanguage);
      setMessages([...newMsgs, { sender: 'ai', text: response.answer }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: currentLanguage === 'ta'
            ? "மன்னிக்கவும், தகவல் பெறுவதில் சிறிய சிக்கல். மீண்டும் முயற்சிக்கவும்."
            : "Sorry, I encountered a brief issue connecting to the AI brain. Please try again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    t('quick_q_1'),
    t('quick_q_2'),
    t('quick_q_3'),
    t('quick_q_4')
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating 3D Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-3d px-5 py-3.5 bg-tourOrange text-white text-base sm:text-lg font-extrabold flex items-center gap-2.5 !rounded-2xl !shadow-[0_8px_0_#5A2B15] animate-bounce-gentle hover:scale-105"
        >
          <Sparkles className="w-6 h-6 text-tourGold" />
          <span>{t('ask_ai')}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="parchment-panel w-[90vw] sm:w-[400px] h-[520px] flex flex-col relative !border-3 !shadow-[0_10px_0_#5A2B15]">
          {/* Header */}
          <div className="p-3.5 bg-tourOrange text-white rounded-t-[22px] border-b-2 border-borderBrown flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-tourOrange flex items-center justify-center shadow-[0_2px_0_#5A2B15]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">{t('chat_header')}</h4>
                <span className="text-[10px] font-bold text-amber-100 flex items-center gap-1">
                  ● Context Aware ({currentLanguage.toUpperCase()})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-3d bg-white text-textBrown p-1.5 !rounded-full !shadow-[0_2px_0_#5A2B15]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-cream-200/90 border-b border-borderBrown/20 flex gap-2 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[11px] font-bold bg-white text-textBrown px-2.5 py-1 rounded-lg border border-borderBrown/40 shadow-sm hover:bg-cream-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 items-start ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-tourOrange text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs sm:text-sm font-semibold border-2 ${
                    m.sender === 'user'
                      ? 'bg-tourOrange text-white border-borderBrown rounded-br-none shadow-[0_2px_0_#5A2B15]'
                      : 'bg-white text-textBrown border-borderBrown rounded-bl-none shadow-[0_2px_0_#5A2B15]'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-tourGreen text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    👤
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs font-bold text-tourOrange">
                <span className="animate-spin">⏳</span> AI is formulating response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-cream-100 rounded-b-[22px] border-t-2 border-borderBrown flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat_placeholder')}
              className="input-3d flex-1 text-xs sm:text-sm !py-2 !px-3"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-3d px-3.5 py-2 bg-tourOrange text-white !rounded-xl"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
