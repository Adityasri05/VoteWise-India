import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Vote, UserCheck, MapPin, MessageSquare, ShieldCheck, Trophy, Info, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle, Star, Award, LayoutDashboard, LogIn, User, Sparkles, Fingerprint, Globe, Bell, Languages, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from './context/LanguageContext';

/** Lazy-loaded route components for optimal code splitting and performance */
const Home = lazy(() => import('./components/Home'));
const BoothLocator = lazy(() => import('./components/BoothLocator'));
const CandidateAwareness = lazy(() => import('./components/CandidateAwareness'));
const VoterProcess = lazy(() => import('./components/VoterProcess'));
const Quiz = lazy(() => import('./components/Quiz'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const HelpCenter = lazy(() => import('./components/HelpCenter'));
const FullChatbot = lazy(() => import('./components/FullChatbot'));

/**
 * Root application component.
 * Manages navigation, authentication state, language selection,
 * and provides the main routing structure with code splitting.
 *
 * @component
 * @returns {JSX.Element} The rendered application shell.
 */
function App() {
  const location = useLocation();
  const { t, language, setLanguage, languages } = useLanguage();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const isAdminPath = location.pathname.startsWith('/admin');
  const isChatPath = location.pathname === '/ai-assistant';
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => { window.removeEventListener('scroll', handleScroll); unsubscribe(); };
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  /**
   * Handles user logout via Firebase Auth.
   * @async
   */
  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) { console.error("Logout failed:", error); }
  };

  /** @type {Array<{to: string, label: string}>} Navigation link configuration */
  const navLinks = [
    { to: '/', label: t.dashboard },
    { to: '/process', label: t.journey },
    { to: '/booth', label: t.stations },
    { to: '/candidates', label: t.candidates },
    { to: '/ai-assistant', label: t.aiAssistant },
  ];

  return (
    <div className={`app-container ${isChatPath ? 'chat-active' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-close"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            <nav aria-label="Mobile navigation">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mobile-actions">
              {/* Language picker */}
              <div className="mobile-lang-list" role="radiogroup" aria-label="Language selection">
                {languages.map(l => (
                  <div
                    key={l.name}
                    onClick={() => { setLanguage(l.name); setMobileMenuOpen(false); }}
                    className={`mobile-lang-btn ${language === l.name ? 'active' : ''}`}
                    role="radio"
                    aria-checked={language === l.name}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setLanguage(l.name); setMobileMenuOpen(false); } }}
                  >
                    {l.name}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setMobileMenuOpen(false); user ? handleLogout() : setIsAuthModalOpen(true); }}
                aria-label={user ? 'Sign out' : 'Sign in'}
              >
                {user ? t.logout : <><LogIn size={18} /> {t.joinNow}</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="drawer-overlay"
          aria-hidden="true"
        />
      )}

      {!isAdminPath && !isChatPath && (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
          <Link to="/" className="nav-logo" aria-label="VoteWise home">
            <div className="nav-logo-icon">
              <Vote size={28} color="white" />
            </div>
            <span className="nav-logo-text">
              VoteWise<span className="nav-logo-accent">.in</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link ${location.pathname === link.to ? 'active' : ''}`} aria-current={location.pathname === link.to ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="nav-actions">
            <div className="lang-picker-container">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="lang-picker-btn"
                aria-label="Select language"
                aria-expanded={showLangMenu}
              >
                <Languages size={18} /> {language}
              </button>
              {showLangMenu && (
                <div className="lang-dropdown" role="listbox" aria-label="Available languages">
                  {languages.map(l => (
                    <div 
                      key={l.name} 
                      onClick={() => { setLanguage(l.name); setShowLangMenu(false); }} 
                      className={`lang-item ${language === l.name ? 'active' : ''}`}
                      role="option"
                      aria-selected={language === l.name}
                    >
                      {l.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="nav-bell-btn" aria-label="Notifications">
              <Bell size={22} />
            </button>
            <button className="nav-auth-btn btn btn-primary" onClick={user ? handleLogout : () => setIsAuthModalOpen(true)} aria-label={user ? 'Sign out' : 'Sign in'}>
              {user ? (<><img src={user.photoURL} alt={user.displayName} className="nav-user-avatar" />{t.logout}</>) : (<><LogIn size={18} /> {t.joinNow}</>)}
            </button>
          </div>

          {/* Hamburger (mobile) */}
          <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" aria-expanded={mobileMenuOpen}>
            <span /><span /><span />
          </button>
        </nav>
      )}

      <main className="app-main-content" id="main-content">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Suspense fallback={
              <div className="loading-spinner" role="status" aria-label="Loading page content">
                <div className="spinner" aria-hidden="true" />
                <span>Loading...</span>
              </div>
            }>
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
            </Suspense>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {!isAdminPath && !isChatPath && (
        <footer className="main-footer" role="contentinfo">
          <div className="footer-container">
            <div className="footer-brand-section">
              <div className="footer-logo">
                <Vote size={32} color="var(--primary-accent)" />
                <span className="footer-logo-text">VoteWise</span>
              </div>
              <p className="footer-tagline">
                The definitive AI-powered platform for the modern Indian voter.
              </p>
              <Link to="/admin" className="staff-portal-link">Staff Portal</Link>
            </div>
            <div className="footer-links-section">
              <h4 className="footer-heading">Platform</h4>
              <ul className="footer-links-list">
                {[['Registration', '/process'], ['Booth Maps', '/booth'], ['AI Profiles', '/candidates'], ['Certification', '/quiz']].map(([label, path]) => (
                  <li key={path}><Link to={path} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="footer-links-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links-list">
                {['Helpline 1950', 'Complaints', 'Voter FAQ', 'Accessibility'].map(label => (
                  <li key={label}><Link to="/help" className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="footer-newsletter-section">
              <h4 className="footer-heading">Election Alerts</h4>
              <p className="newsletter-text">Subscribe for polling dates and registration deadlines.</p>
              <div className="newsletter-input-group">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input id="newsletter-email" type="email" placeholder="email@voter.in" className="newsletter-input" aria-label="Email for election alerts" />
                <button className="btn btn-primary newsletter-btn" aria-label="Subscribe to alerts"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 VoteWise India. Excellence in Civic Technology.
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
