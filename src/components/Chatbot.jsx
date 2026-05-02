import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Languages, Zap, MapPin, Trophy, Mic, MicOff, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/gemini';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Namaste! I am your VoteWise AI. 🇮🇳\nI can help you navigate the entire election process. What would you like to do first?',
      suggestions: [
        { label: 'Register to Vote', icon: <Zap size={14} />, action: 'registration' },
        { label: 'Find my Polling Booth', icon: <MapPin size={14} />, action: 'booth' },
        { label: 'Take a Quick Quiz', icon: <Trophy size={14} />, action: 'quiz' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Speech Recognition Logic
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'English' ? 'en-IN' : 'hi-IN';

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSuggestion = (suggestion) => {
    if (suggestion.action === 'registration') {
      handleSend("Tell me how to register as a new voter.");
    } else if (suggestion.action === 'booth') {
      navigate('/booth');
      setIsOpen(false);
    } else if (suggestion.action === 'quiz') {
      navigate('/quiz');
      setIsOpen(false);
    }
  };

  const handleSend = async (customInput = null) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages
        .filter(msg => msg.role !== 'bot' || messages.indexOf(msg) !== 0)
        .map(msg => ({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const response = await generateChatResponse(textToSend, chatHistory, language);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        suggestions: response.toLowerCase().includes('quiz') ? [{ label: 'Go to Quiz', icon: <Trophy size={14} />, action: 'quiz' }] : []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having a bit of trouble. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                position: 'absolute', bottom: '90px', right: 0,
                background: 'white', padding: '1rem 1.5rem', borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', whiteSpace: 'nowrap',
                fontWeight: 700, border: '1px solid var(--border)', display: 'flex', gap: '0.8rem', alignItems: 'center',
                pointerEvents: 'none'
              }}
            >
              <Sparkles size={18} color="var(--primary-accent)" />
              AI Assistant Ready
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-primary"
              onClick={() => setIsOpen(true)}
              style={{ 
                width: '70px', height: '70px', borderRadius: '24px', 
                padding: 0, justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
              }}
            >
              <MessageSquare size={30} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            style={{
              width: 'min(420px, 90vw)', height: 'min(650px, 80vh)',
              background: 'white',
              borderRadius: '28px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '1.2rem 1.5rem', 
              background: 'var(--primary)', 
              color: 'white',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: 'var(--primary-accent)', padding: '0.5rem', borderRadius: '12px' }}>
                  <Bot size={20} color="white" />
                </div>
                <div>
                  <h4 style={{ color: 'white', margin: 0, fontSize: '1rem' }}>VoteWise AI</h4>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Powered by Gemini 2.5 Flash Lite</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {language}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '1rem 1.2rem',
                      borderRadius: '20px',
                      background: msg.role === 'user' ? 'var(--primary-accent)' : '#f1f5f9',
                      color: msg.role === 'user' ? 'white' : 'var(--text)',
                      fontSize: '0.95rem',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.text}
                  </motion.div>
                  
                  {msg.suggestions && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem' }}>
                      {msg.suggestions.map((s, si) => (
                        <button
                          key={si}
                          onClick={() => handleSuggestion(s)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 0.8rem', borderRadius: '12px',
                            background: 'white', border: '1px solid var(--primary-accent)',
                            color: 'var(--primary-accent)', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '0.8rem 1.2rem', borderRadius: '18px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Loader2 size={16} className="animate-spin" color="var(--primary-accent)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* API Key Warning if placeholder is present */}
            {window.location.hostname === 'localhost' && import.meta.env.VITE_GEMINI_API_KEY === undefined && (
               <div style={{ padding: '0.5rem 1rem', background: '#fef2f2', borderTop: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#dc2626' }}>
                 <AlertCircle size={14} />
                 <span>Set <b>VITE_GEMINI_API_KEY</b> in .env for AI responses.</span>
               </div>
            )}

            {/* Input */}
            <div style={{ padding: '1.2rem', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'English' ? "Type a message..." : "संदेश लिखें..."}
                    style={{
                      width: '100%', padding: '0.8rem 1rem', paddingRight: '2.5rem',
                      borderRadius: '14px', border: '1px solid var(--border)',
                      fontSize: '0.95rem', outline: 'none'
                    }}
                  />
                  <button 
                    onClick={toggleListening}
                    style={{ 
                      position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isListening ? 'var(--error)' : 'var(--text-muted)'
                    }}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  style={{ 
                    width: '45px', height: '45px', borderRadius: '14px', 
                    background: input.trim() ? 'var(--primary-accent)' : '#cbd5e1', color: 'white',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
