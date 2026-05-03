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
    <div className="floating-chatbot-root">
      <AnimatePresence>
        {!isOpen && (
          <motion.div className="floating-trigger-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="floating-tooltip"
            >
              <Sparkles size={18} color="var(--primary-accent)" />
              AI Assistant Ready
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-primary floating-trigger-btn"
              onClick={() => setIsOpen(true)}
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
            className="floating-chat-window"
          >
            {/* Header */}
            <div className="floating-chat-header">
              <div className="chat-header-identity">
                <div className="bot-icon-wrapper">
                  <Bot size={20} color="white" />
                </div>
                <div>
                  <h4 className="chat-header-title">VoteWise AI</h4>
                  <span className="chat-header-subtitle">Powered by Gemini 2.5 Flash Lite</span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button 
                  onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
                  className="lang-toggle-btn"
                >
                  {language}
                </button>
                <button onClick={() => setIsOpen(false)} className="close-chat-btn">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="floating-messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                  >
                    {msg.text}
                  </motion.div>
                  
                  {msg.suggestions && (
                    <div className="chat-suggestions-container">
                      {msg.suggestions.map((s, si) => (
                        <button
                          key={si}
                          onClick={() => handleSuggestion(s)}
                          className="chat-suggestion-chip"
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-typing-indicator">
                  <Loader2 size={16} className="animate-spin" color="var(--primary-accent)" />
                  <span className="typing-text">Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* API Key Warning */}
            {window.location.hostname === 'localhost' && import.meta.env.VITE_GEMINI_API_KEY === undefined && (
               <div className="api-warning-banner">
                 <AlertCircle size={14} />
                 <span>Set <b>VITE_GEMINI_API_KEY</b> in .env for AI responses.</span>
               </div>
            )}

            {/* Input */}
            <div className="floating-input-footer">
              <div className="floating-input-row">
                <div className="chat-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'English' ? "Type a message..." : "संदेश लिखें..."}
                    className="floating-chat-input"
                  />
                  <button 
                    onClick={toggleListening}
                    className={`mic-toggle-btn ${isListening ? 'active' : ''}`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={`chat-send-btn ${input.trim() ? 'enabled' : 'disabled'}`}
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
