import React, { useState, useEffect, useRef } from 'react';
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

const FullChatbot = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, languages } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
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
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a', color: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar - VoteWise Branded Slate */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '260px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{ 
              background: '#020617', display: 'flex', flexDirection: 'column',
              height: '100%', borderRight: '1px solid #1e293b', overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
                  <Sparkles size={16} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>VoteWise</span>
              </div>
              <motion.div 
                whileHover={{ background: '#1e293b' }} 
                onClick={() => setIsSidebarOpen(false)}
                style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <PanelLeftClose size={20} color="#94a3b8" />
              </motion.div>
            </div>

            <div style={{ padding: '0 0.8rem' }}>
              <motion.button 
                whileHover={{ background: '#1e293b', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMessages([]);
                  setShowLanguages(false);
                }}
                style={{ 
                  width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', 
                  background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Plus size={18} /> <span>New Journey</span>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem' }}>AI</div>
              </motion.button>
              
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input 
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '10px',
                    background: '#1e293b', border: '1px solid #334155', color: 'white',
                    fontSize: '0.85rem', outline: 'none'
                  }}
                />
                <Search size={14} color="#64748b" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0.8rem 1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', padding: '0 1rem', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Assistants</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(assistantModes).map(([mode, data]) => (
                  <motion.div 
                    key={mode}
                    whileHover={{ background: '#1e293b' }} 
                    onClick={() => switchAssistant(mode)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.8rem', 
                      padding: '0.7rem 1rem', borderRadius: '8px', cursor: 'pointer',
                      background: activeAssistant === mode ? `${data.color}15` : 'transparent',
                      border: activeAssistant === mode ? `1px solid ${data.color}40` : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '6px', 
                      background: data.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: activeAssistant === mode ? `0 0 12px ${data.color}60` : 'none'
                    }}>
                      {data.icon}
                    </div>
                    <span style={{ 
                      fontSize: '0.9rem', fontWeight: activeAssistant === mode ? 700 : 600,
                      color: activeAssistant === mode ? data.color : '#f8fafc'
                    }}>
                      {data.label}
                    </span>
                    {activeAssistant === mode && (
                      <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: data.color, boxShadow: `0 0 8px ${data.color}` }} />
                    )}
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', marginTop: '2.5rem', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Recents</div>
                {chatHistory.length > 0 && (
                  <motion.button 
                    whileHover={{ color: '#ef4444' }}
                    onClick={(e) => clearHistory(e)}
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700 }}
                  >
                    <Trash2 size={12} /> Clear
                  </motion.button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {filteredHistory.map((item) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ background: '#1e293b', x: 5 }}
                    onClick={() => handleSend(item.title)}
                    style={{ 
                      padding: '0.7rem 1rem', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <MessageSquare size={14} /> {item.title}
                    </div>
                    <motion.div 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      whileHover={{ color: '#ef4444', scale: 1.2 }}
                      style={{ color: '#475569', padding: '0.2rem' }}
                    >
                      <Trash2 size={12} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#020617' }}>
              <motion.div 
                whileHover={{ background: '#1e293b' }}
                onClick={() => !user && navigate('/')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {user ? (
                    <img src={user.photoURL} alt={user.displayName} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '2px solid var(--primary-accent)' }} />
                  ) : (
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>?</div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user ? user.displayName.split(' ')[0] : 'Guest'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{user ? 'Verified Citizen' : 'Not Logged In'}</div>
                  </div>
                </div>
                <div style={{ background: user ? '#22c55e' : '#64748b', width: '8px', height: '8px', borderRadius: '50%', boxShadow: user ? '0 0 10px #22c55e' : 'none' }}></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: '#0f172a' }}>
        {/* Chat Header */}
        <div style={{ 
          padding: '1rem 2rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10, borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
            {!isSidebarOpen && (
              <motion.div 
                whileHover={{ background: '#1e293b' }} 
                onClick={() => setIsSidebarOpen(true)}
                style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', marginRight: '0.5rem' }}
              >
                <PanelLeftOpen size={20} color="#94a3b8" />
              </motion.div>
            )}
            <div 
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>VoteWise AI <span style={{ color: 'var(--primary-accent)', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', marginLeft: '0.5rem' }}>Beta</span></span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.05, background: 'var(--primary-accent)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              style={{ padding: '0.5rem 1.2rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
            >
              <Trophy size={14} /> {t.dashboard || 'Election Hub'}
            </motion.button>
            <div style={{ position: 'relative' }}>
              <motion.div 
                whileHover={{ background: '#1e293b' }}
                onClick={() => setShowLanguages(!showLanguages)}
                style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: showLanguages ? '#1e293b' : 'transparent' }}
              >
                <Languages size={18} color={showLanguages ? 'var(--primary-accent)' : '#94a3b8'} />
              </motion.div>
              
              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{ 
                      position: 'absolute', top: '120%', right: 0, width: '200px',
                      background: '#020617', border: '1px solid #1e293b', borderRadius: '16px',
                      padding: '0.8rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 100
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', padding: '0 0.5rem', textTransform: 'uppercase' }}>Select Language</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.2rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {languages.map((l) => (
                        <motion.div
                          key={l.name}
                          whileHover={{ background: '#1e293b', x: 5 }}
                          onClick={() => {
                            setLanguage(l.name);
                            setShowLanguages(false);
                          }}
                          style={{ 
                            padding: '0.6rem 0.8rem', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.9rem', color: language === l.name ? 'var(--primary-accent)' : '#94a3b8',
                            background: language === l.name ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            fontWeight: language === l.name ? 700 : 500,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
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
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '15vh' }}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
              >
                <Sparkles size={40} color="white" />
              </motion.div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'white', textAlign: 'center', letterSpacing: '-0.03em' }}>
                {t.botWelcomeTitle}
              </h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
                {initialSuggestions.map((s, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -5, background: '#1e293b' }}
                    onClick={() => handleSuggestion(s)}
                    style={{ padding: '0.8rem 1.5rem', borderRadius: '16px', background: '#020617', border: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                  >
                    {s.icon} {s.label}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '3rem 1.5rem' }}>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  style={{ marginBottom: '2.5rem', display: 'flex', gap: '1.8rem' }}
                >
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, 
                    background: msg.role === 'user' ? '#334155' : 'var(--primary-accent)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3rem',
                    boxShadow: msg.role === 'bot' ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
                  }}>
                    {msg.role === 'user' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.85rem', color: msg.role === 'user' ? '#94a3b8' : 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {msg.role === 'user' ? 'Citizen Request' : 'VoteWise Intelligence'}
                    </div>
                    <div style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#f1f5f9', whiteSpace: 'pre-wrap', fontWeight: 500 }}>{msg.text}</div>
                    
                    {msg.role === 'bot' && (
                      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.2rem' }}>
                        <button onClick={() => speakText(msg.text, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                          {isSpeaking === i ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button onClick={() => copyToClipboard(msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                          <Copy size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '1.8rem', marginBottom: '2.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="white" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1e293b', padding: '0.8rem 1.2rem', borderRadius: '16px' }}>
                    {[1,2,3].map(i => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} style={{ width: '6px', height: '6px', background: 'var(--primary-accent)', borderRadius: '50%' }} />)}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '0.5rem', fontWeight: 600 }}>{t.analyzeData}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Footer Area - VoteWise Pill Style */}
        <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
          <div style={{ 
            background: '#1e293b', borderRadius: '24px', padding: '0.6rem 1.2rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <motion.button whileHover={{ background: '#334155' }} style={{ padding: '0.5rem', borderRadius: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <Plus size={22} />
            </motion.button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={loading ? t.analyzeData : t.askAnything}
                style={{
                  flex: 1, padding: '0.8rem 0', background: 'transparent', border: 'none', outline: 'none',
                  fontSize: '1.1rem', color: 'white', resize: 'none', height: '48px', fontFamily: 'inherit',
                  fontWeight: 500
                }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <motion.button
                onClick={toggleListening}
                whileHover={{ scale: 1.1, color: '#3b82f6' }}
                style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: isListening ? '#ef4444' : '#94a3b8' }}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </motion.button>
              
              <motion.button
                whileHover={input.trim() ? { scale: 1.1, background: '#2563eb' } : {}}
                whileTap={input.trim() ? { scale: 0.9 } : {}}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  background: input.trim() ? '#3b82f6' : '#334155', 
                  color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
            VoteWise AI is an educational assistant. Verify critical details with the <a href="https://eci.gov.in" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Election Commission of India</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullChatbot;
