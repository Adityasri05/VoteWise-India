import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Bot, User, Loader2, Sparkles, Languages, Trash2, 
  Copy, Volume2, VolumeX, History, Plus, MessageSquare, 
  Search, Check, Share2, Info, Mic, MicOff, Zap, MapPin, Trophy, ChevronRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/gemini';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Simple Error Boundary for Markdown rendering
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="markdown-fallback">{this.props.content}</div>;
    }
    return this.props.children;
  }
}

const FullChatbot = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, languages } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [user, setUser] = useState(null);
  const [activeAssistant, setActiveAssistant] = useState('default');
  const messagesEndRef = useRef(null);

  const assistantModes = {
    'voter-education': {
      label: 'Voter Education',
      icon: <Bot size={14} color="white" />,
      color: '#22c55e',
      greeting: '📚 Voter Education Mode Active!',
      greetingSub: 'Ask me anything about voter registration, EVM, VVPAT, Form 6, voting rights, and the complete election process.',
    },
    'real-time-updates': {
      label: 'Real-time Updates',
      icon: <Zap size={14} color="white" />,
      color: '#f59e0b',
      greeting: '⚡ Election Updates Mode Active!',
      greetingSub: 'Ask me about election schedules, polling dates, voter registration deadlines, ECI announcements, and more.',
    }
  };

  const switchAssistant = (mode) => {
    setActiveAssistant(mode);
    const modeData = assistantModes[mode];
    setMessages([{
      role: 'bot',
      text: modeData.greeting + '\n' + modeData.greetingSub,
      timestamp: new Date().toLocaleTimeString(),
      suggestions: initialSuggestions
    }]);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, []);

  // languages removed (now from context)

  const initialSuggestions = [
    { label: t.suggestion1, icon: <Zap size={14} />, action: 'registration' },
    { label: t.suggestion2, icon: <MapPin size={14} />, action: 'booth' },
    { label: t.suggestion3, icon: <Trophy size={14} />, action: 'quiz' },
    { label: t.suggestion4, icon: <Search size={14} />, action: 'candidates' }
  ];

  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('voteWiseHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
    
    // Initial localized greeting
    setMessages([
      { 
        role: 'bot', 
        text: t.botWelcomeTitle + " 🇮🇳\n" + (t.botWelcomeSub || "Your AI Election Assistant"),
        timestamp: new Date().toLocaleTimeString(),
        suggestions: initialSuggestions
      }
    ]);
  }, [language]);

  const clearHistory = (e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setChatHistory([]);
      localStorage.removeItem('voteWiseHistory');
      setSearchTerm(''); // Reset search when clearing
    }
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    const updatedHistory = chatHistory.filter(item => item.id !== id);
    setChatHistory(updatedHistory);
    localStorage.setItem('voteWiseHistory', JSON.stringify(updatedHistory));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    const langCode = languages.find(l => l.name === language)?.code || 'en-IN';
    recognition.lang = langCode;

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
    } else if (suggestion.action === 'quiz') {
      navigate('/quiz');
    }
  };

  const handleSend = async (customInput = null) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    const userMessage = { 
      role: 'user', 
      text: textToSend, 
      timestamp: new Date().toLocaleTimeString() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyForAI = messages
        .filter(msg => msg.role !== 'bot' || messages.indexOf(msg) !== 0)
        .map(msg => ({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const response = await generateChatResponse(textToSend, historyForAI, language, activeAssistant);
      const botMessage = { 
        role: 'bot', 
        text: response, 
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.toLowerCase().includes('quiz') ? [{ label: 'Go to Quiz', icon: <Trophy size={14} />, action: 'quiz' }] : []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (messages.length <= 2) {
        const newHistoryItem = {
          id: Date.now(),
          title: textToSend.substring(0, 30) + (textToSend.length > 30 ? '...' : ''),
          date: new Date().toLocaleDateString(),
          preview: response.substring(0, 50) + '...'
        };
        const updatedHistory = [newHistoryItem, ...chatHistory.slice(0, 19)];
        setChatHistory(updatedHistory);
        localStorage.setItem('voteWiseHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm experiencing some connectivity issues. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };


  const speakText = (text, index) => {
    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = languages.find(l => l.name === language)?.code || 'en-IN';
    utterance.lang = langCode;
    
    utterance.onend = () => setIsSpeaking(null);
    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  const filteredHistory = chatHistory.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="full-chat-container">
      {/* Sidebar - VoteWise Branded Slate */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`full-chat-sidebar ${window.innerWidth <= 768 ? 'mobile' : ''}`}
          >
            <div className="sidebar-brand">
              <div className="brand-logo-container">
                <div className="brand-icon-box">
                  <Sparkles size={16} color="white" />
                </div>
                <span className="brand-name">VoteWise</span>
              </div>
              <motion.div 
                whileHover={{ background: '#1e293b' }} 
                onClick={() => setIsSidebarOpen(false)}
                className="sidebar-close-btn"
              >
                <PanelLeftClose size={20} color="#94a3b8" />
              </motion.div>
            </div>

            <div className="sidebar-content">
              <motion.button 
                whileHover={{ background: '#1e293b', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMessages([]);
                  setShowLanguages(false);
                }}
                className="new-chat-btn"
              >
                <div className="new-chat-btn-inner">
                  <Plus size={18} /> <span>New Journey</span>
                </div>
                <div className="ai-tag-badge">AI</div>
              </motion.button>
              
              <div className="search-box-wrapper">
                <input 
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-field"
                />
                <Search size={14} color="#64748b" className="search-input-icon" />
              </div>
            </div>

            <div className="sidebar-scroll-area">
              <div className="assistant-modes-container">
                {Object.entries(assistantModes).map(([mode, data]) => (
                  <motion.div 
                    key={mode}
                    whileHover={{ background: '#1e293b' }} 
                    onClick={() => switchAssistant(mode)}
                    className={`assistant-mode-item ${activeAssistant === mode ? 'active' : ''}`}
                    style={{ 
                      '--mode-color': data.color,
                      '--mode-bg': `${data.color}15`,
                      '--mode-border': `${data.color}40`,
                    }}
                  >
                    <div className="mode-icon-box">
                      {data.icon}
                    </div>
                    <span className="assistant-mode-label">
                      {data.label}
                    </span>
                    {activeAssistant === mode && (
                      <div className="active-mode-dot" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="history-header-box">
                <div className="sidebar-section-title no-padding">Your Recents</div>
                {chatHistory.length > 0 && (
                  <motion.button 
                    whileHover={{ color: '#ef4444' }}
                    onClick={(e) => clearHistory(e)}
                    className="clear-history-btn"
                  >
                    <Trash2 size={12} /> Clear
                  </motion.button>
                )}
              </div>
              <div className="history-list">
                {filteredHistory.map((item) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ background: '#1e293b', x: 5 }}
                    onClick={() => handleSend(item.title)}
                    className="history-item-row"
                  >
                    <div className="history-item-content">
                      <MessageSquare size={14} /> {item.title}
                    </div>
                    <motion.div 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      whileHover={{ color: '#ef4444', scale: 1.2 }}
                      className="delete-history-btn"
                    >
                      <Trash2 size={12} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="sidebar-footer">
              <motion.div 
                whileHover={{ background: '#1e293b' }}
                onClick={() => !user && navigate('/')}
                className="user-profile-bar"
              >
                <div className="user-profile-info">
                  {user ? (
                    <img src={user.photoURL} alt={user.displayName} className="user-avatar-small" />
                  ) : (
                    <div className="user-avatar-placeholder-small">?</div>
                  )}
                  <div className="user-profile-text-content">
                    <div className="user-profile-name">{user ? user.displayName.split(' ')[0] : 'Guest'}</div>
                    <div className="user-profile-status">{user ? 'Verified Citizen' : 'Not Logged In'}</div>
                  </div>
                </div>
                <div className={`status-dot ${user ? 'online' : 'offline'}`}></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="full-chat-main">
        {/* Chat Header */}
        <div className="chat-view-header">
          <div className="header-logo-container">
            {!isSidebarOpen && (
              <motion.div 
                whileHover={{ background: '#1e293b' }} 
                onClick={() => setIsSidebarOpen(true)}
                className="sidebar-toggle-btn"
              >
                <PanelLeftOpen size={20} color="#94a3b8" />
              </motion.div>
            )}
            <div 
              onClick={() => navigate('/')}
              className="header-logo-container"
            >
              <div className="header-logo-icon">
                <Sparkles size={20} color="white" />
              </div>
              <span className="header-logo-text">VoteWise AI <span className="beta-tag">Beta</span></span>
            </div>
          </div>
          
          <div className="header-actions">
            <motion.button 
              whileHover={{ scale: 1.05, background: 'var(--primary-accent)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="hub-btn"
            >
              <Trophy size={14} /> {t.dashboard || 'Election Hub'}
            </motion.button>
            <div className="lang-picker-wrapper">
              <motion.div 
                whileHover={{ background: '#1e293b' }}
                onClick={() => setShowLanguages(!showLanguages)}
                className={`lang-trigger ${showLanguages ? 'active' : ''}`}
              >
                <Languages size={18} color={showLanguages ? 'var(--primary-accent)' : '#94a3b8'} />
              </motion.div>
              
              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="lang-dropdown-full"
                  >
                    <div className="dropdown-label">Select Language</div>
                    <div className="lang-grid">
                      {languages.map((l) => (
                        <motion.div
                          key={l.name}
                          whileHover={{ background: '#1e293b', x: 5 }}
                          className={`lang-option ${language === l.name ? 'active' : ''}`}
                          onClick={() => {
                            setLanguage(l.name);
                            setShowLanguages(false);
                          }}
                        >
                          {l.name}
                          {language === l.name && <Check size={14} />}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Messages Container or Empty State */}
        <div className="chat-scroll-container">
          {messages.length === 0 ? (
            <div className="empty-chat-placeholder">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="placeholder-icon"
              >
                <Sparkles size={40} color="white" />
              </motion.div>
              <h1 className="placeholder-title">
                {t.botWelcomeTitle}
              </h1>
              <div className="suggestion-buttons-grid">
                {initialSuggestions.map((s, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -5, background: '#1e293b' }}
                    onClick={() => handleSuggestion(s)}
                    className="suggestion-btn"
                  >
                    {s.icon} {s.label}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-message-list">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className="message-row"
                >
                    <div className={`message-avatar-box ${msg.role === 'user' ? 'user' : 'bot bot-avatar-glow'}`}>
                      {msg.role === 'user' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                    </div>
                    <div className="message-content-area">
                      <div className={`message-sender-label ${msg.role === 'user' ? 'user' : 'bot'}`}>
                        {msg.role === 'user' ? 'Citizen Request' : 'VoteWise Intelligence'}
                      </div>
                    {msg.role === 'user' ? (
                      <div className="message-text-body pre-wrap">{msg.text}</div>
                    ) : (
                      <div className="message-text-body markdown-body">
                        <MarkdownErrorBoundary content={msg.text}>
                          <ReactMarkdown className="markdown-content">
                            {msg.text || ''}
                          </ReactMarkdown>
                        </MarkdownErrorBoundary>
                      </div>
                    )}
                    
                    {msg.role === 'bot' && (
                      <div className="message-actions">
                        <button onClick={() => speakText(msg.text, i)} className="action-btn-small">
                          {isSpeaking === i ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button onClick={() => copyToClipboard(msg.text)} className="action-btn-small">
                          <Copy size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="message-row loading">
                  <div className="message-avatar-box bot bot-avatar-primary">
                    <Bot size={20} color="white" />
                  </div>
                  <div className="loading-indicator-box">
                    {[1,2,3].map(i => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} className="loading-circle" />)}
                    <span className="loading-text">{t.analyzeData}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Footer Area - VoteWise Pill Style */}
        <div className="chat-input-section">
          <div className="chat-input-pill">
            <motion.button whileHover={{ background: '#334155' }} className="input-action-btn">
              <Plus size={22} />
            </motion.button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={loading ? t.analyzeData : t.askAnything}
                className="chat-input-textarea"
            />

            <div className="input-controls">
              <motion.button
                onClick={toggleListening}
                whileHover={{ scale: 1.1, color: '#3b82f6' }}
                className={`voice-input-btn ${isListening ? 'listening' : ''}`}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </motion.button>
              
              <motion.button
                whileHover={input.trim() ? { scale: 1.1, background: '#2563eb' } : {}}
                whileTap={input.trim() ? { scale: 0.9 } : {}}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={`send-btn ${input.trim() ? 'active' : ''}`}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
          <div className="chat-disclaimer">
            VoteWise AI is an educational assistant. Verify critical details with the <a href="https://eci.gov.in" target="_blank" rel="noreferrer">Election Commission of India</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullChatbot;
