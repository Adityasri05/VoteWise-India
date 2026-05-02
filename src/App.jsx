import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Vote, UserCheck, MapPin, MessageSquare, ShieldCheck, Trophy, Info, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle, Star, Award, LayoutDashboard, LogIn, User, Sparkles, Fingerprint, Globe, Bell, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './components/Timeline';
import BoothLocator from './components/BoothLocator';
import CandidateAwareness from './components/CandidateAwareness';
import VoterProcess from './components/VoterProcess';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import HelpCenter from './components/HelpCenter';
import FullChatbot from './components/FullChatbot';
import AuthModal from './components/AuthModal';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from './context/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const journeySteps = [
    { icon: <Fingerprint />, title: t.eligibility, desc: 'Secure verification of your voting rights.', path: '/process', color: '#3b82f6' },
    { icon: <ShieldCheck />, title: t.registration, desc: 'Seamless digital enrollment process.', path: '/process', color: '#10b981' },
    { icon: <Globe />, title: t.findBooth, desc: 'Real-time GPS station tracking.', path: '/booth', color: '#f59e0b' },
    { icon: <Sparkles />, title: t.castVote, desc: 'Advanced EVM & VVPAT guidance.', path: '/process', color: '#8b5cf6' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <section className="hero" style={{ padding: '10rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Sparkles size={18} color="#fbbf24" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Next-Gen Election Assistant</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t.heroTitle.split('Through')[0]} <br/> Through <span style={{ color: 'var(--primary-accent)' }}>{t.heroTitle.split('Through')[1] || 'AI Intelligence'}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t.heroDesc}
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}
          >
            <Link to="/process" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1rem' }}>
              {t.beginJourney} <ChevronRight size={20} />
            </Link>
            <Link to="/booth" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '1.2rem 3rem' }}>
              {t.locateStations}
            </Link>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--primary-accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.1, zIndex: 0 }}></div>
      </section>

      <div className="main-content">
        <div style={{ marginBottom: '8rem' }}>
          <h2 className="section-title">{t.digitalJourney}</h2>
          <div className="card-grid">
            {journeySteps.map((step, i) => (
              <motion.div 
                key={i} 
                className="card" 
                whileHover={{ y: -15, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)' }}
                style={{ textAlign: 'left', overflow: 'hidden', position: 'relative' }}
              >
                <div style={{ 
                  background: `${step.color}15`, 
                  width: '70px', height: '70px', 
                  borderRadius: '20px', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '2rem', color: step.color,
                  border: `1px solid ${step.color}30`
                }}>
                  {React.cloneElement(step.icon, { size: 34 })}
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{step.desc}</p>
                <Link to={step.path} style={{ color: step.color, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Explore Step <ChevronRight size={18} />
                </Link>
                
                {/* Accent line */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: step.color, opacity: 0.3 }}></div>
              </motion.div>
            ))}
          </div>
        </div>

        <Timeline />

        <div style={{ marginTop: '8rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '6rem 4rem', borderRadius: '40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Trophy size={64} color="var(--accent)" style={{ marginBottom: '2rem' }} />
              <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 2rem' }}>Level Up Your <span style={{ color: 'var(--accent)' }}>Civic IQ</span></h2>
              <p style={{ fontSize: '1.3rem', opacity: 0.8, marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem' }}>Master the election process and earn exclusive digital badges that certify your knowledge as an informed citizen.</p>
              
              <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {[
                  { icon: <Award />, title: 'Early Voter', desc: 'Verified identity status', color: '#fbbf24' },
                  { icon: <Star />, title: 'Policy Maven', desc: 'EVM mastery certificate', color: '#60a5fa' },
                  { icon: <ShieldCheck />, title: 'Guardian', desc: 'Truth-seeker achievement', color: '#34d399' }
                ].map((badge, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ color: badge.color, marginBottom: '1.5rem' }}>{React.cloneElement(badge.icon, { size: 48 })}</div>
                    <h4 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{badge.title}</h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{badge.desc}</p>
                  </div>
                ))}
              </div>
              
              <Link to="/quiz" className="btn btn-primary" style={{ marginTop: '4rem', background: 'var(--accent)', padding: '1.2rem 4rem', fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>Start Certification Quiz</Link>
            </motion.div>
          </div>
          
          {/* Background shapes */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
        </div>

        <div style={{ marginTop: '8rem', background: 'white', padding: '5rem', borderRadius: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
          <h2 className="section-title">Truth & Clarity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#fef2f2', padding: '3rem', borderRadius: '30px', border: '1px solid #fee2e2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--error)', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                <AlertTriangle size={28} /> POPULAR MYTH
              </div>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: '1.4', color: '#991b1b' }}>"Your vote is not secret and can be traced back to you by the government."</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#ecfdf5', padding: '3rem', borderRadius: '30px', border: '1px solid #d1fae5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success)', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                <CheckCircle2 size={28} /> VERIFIED FACT
              </div>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: '1.4', color: '#065f46' }}>"The secrecy of the ballot is legally protected. No machine or official can identify who you voted for."</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const { t, language, setLanguage, languages } = useLanguage();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const isAdminPath = location.pathname.startsWith('/admin');
  const isChatPath = location.pathname === '/ai-assistant';
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="app-container" style={isChatPath ? { height: '100vh', overflow: 'hidden', position: 'fixed', width: '100%', top: 0, left: 0 } : {}}>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {!isAdminPath && !isChatPath && (
        <nav className="navbar" style={{ padding: scrolled ? '0.8rem 5%' : '1.5rem 5%', boxShadow: scrolled ? 'var(--shadow)' : 'none' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px' }}>
              <Vote size={28} color="white" />
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em' }}>
              VoteWise<span style={{ color: 'var(--primary-accent)' }}>.in</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: location.pathname === '/' ? 'var(--primary-accent)' : 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{t.dashboard}</Link>
            <Link to="/process" style={{ textDecoration: 'none', color: location.pathname === '/process' ? 'var(--primary-accent)' : 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{t.journey}</Link>
            <Link to="/booth" style={{ textDecoration: 'none', color: location.pathname === '/booth' ? 'var(--primary-accent)' : 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{t.stations}</Link>
            <Link to="/candidates" style={{ textDecoration: 'none', color: location.pathname === '/candidates' ? 'var(--primary-accent)' : 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{t.candidates}</Link>
            <Link to="/ai-assistant" style={{ textDecoration: 'none', color: location.pathname === '/ai-assistant' ? 'var(--primary-accent)' : 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{t.aiAssistant}</Link>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text)', fontWeight: 600 }}
                >
                  <Languages size={18} /> {language}
                </button>
                {showLangMenu && (
                  <div style={{ position: 'absolute', top: '120%', right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', boxShadow: 'var(--shadow-lg)', zIndex: 1100, minWidth: '150px', maxHeight: '300px', overflowY: 'auto' }}>
                    {languages.map(l => (
                      <div 
                        key={l.name}
                        onClick={() => { setLanguage(l.name); setShowLangMenu(false); }}
                        style={{ padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', background: language === l.name ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: language === l.name ? 'var(--primary-accent)' : 'var(--text)', fontWeight: language === l.name ? 700 : 500 }}
                      >
                        {l.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                <Bell size={22} />
              </button>
              <button 
                className="btn btn-primary" 
                style={{ borderRadius: '14px', padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                onClick={user ? handleLogout : handleLogin}
              >
                {user ? (
                  <>
                    <img src={user.photoURL} alt={user.displayName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    {t.logout}
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> {t.joinNow}
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<VoterProcess />} />
            <Route path="/booth" element={<BoothLocator />} />
            <Route path="/candidates" element={<CandidateAwareness />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/ai-assistant" element={<FullChatbot />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAdminPath && !isChatPath && (
        <footer style={{ background: 'var(--primary)', color: 'white', padding: '8rem 5% 4rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Vote size={32} color="var(--primary-accent)" />
                <span style={{ fontSize: '2rem', fontWeight: 900 }}>VoteWise</span>
              </div>
              <p style={{ opacity: 0.6, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                The definitive AI-powered platform for the modern Indian voter. 
                Securing democracy through education, transparency, and intelligence.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/admin" style={{ color: 'white', opacity: 0.4, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '10px' }}>Staff Portal</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><Link to="/process" style={{ color: 'white', textDecoration: 'none', opacity: 0.6, transition: 'opacity 0.2s' }}>Registration</Link></li>
                <li><Link to="/booth" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Booth Maps</Link></li>
                <li><Link to="/candidates" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>AI Profiles</Link></li>
                <li><Link to="/quiz" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Certification</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>Support</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><Link to="/help" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Helpline 1950</Link></li>
                <li><Link to="/help" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Complaints</Link></li>
                <li><Link to="/help" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Voter FAQ</Link></li>
                <li><Link to="/help" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>Accessibility</Link></li>
              </ul>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Election Alerts</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1.5rem' }}>Subscribe for polling dates and registration deadlines.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="email" placeholder="email@voter.in" style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white' }} />
                <button className="btn btn-primary" style={{ padding: '0.8rem' }}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '5rem', paddingTop: '3rem', textAlign: 'center', opacity: 0.4, fontSize: '1rem' }}>
            &copy; 2026 VoteWise India. Excellence in Civic Technology.
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
