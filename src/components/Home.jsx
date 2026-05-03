import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Fingerprint, ShieldCheck, Globe, Trophy, Award, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Timeline from './Timeline';

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
      <section className="hero">
        <div className="hero-container">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hero-badge"
          >
            <Sparkles size={18} color="#fbbf24" />
            <span>Next-Gen Election Assistant</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t.heroTitle.split('Through')[0]} <br /> Through <span className="hero-highlight">{t.heroTitle.split('Through')[1] || 'AI Intelligence'}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hero-description"
          >
            {t.heroDesc}
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hero-btn-group"
          >
            <Link to="/process" className="btn btn-primary hero-cta-btn">
              {t.beginJourney} <ChevronRight size={20} />
            </Link>
            <Link to="/booth" className="hero-btn-outline">
              {t.locateStations}
            </Link>
          </motion.div>
        </div>
        
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
      </section>

      <div className="main-content">
        <div className="section-spacing">
          <h2 className="section-title">{t.digitalJourney}</h2>
          <div className="card-grid">
            {journeySteps.map((step, i) => (
              <motion.div 
                key={i} 
                className="card journey-card" 
                style={{ '--card-color': step.color }}
                whileHover={{ y: -15, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)' }}
              >
                <div className="journey-icon-wrapper">
                  {React.cloneElement(step.icon, { size: 34 })}
                </div>
                <h3 className="journey-card-title">{step.title}</h3>
                <p className="journey-card-desc">{step.desc}</p>
                <Link to={step.path} className="journey-card-link">
                  Explore Step <ChevronRight size={18} />
                </Link>
                <div className="journey-card-accent-bar"></div>
              </motion.div>
            ))}
          </div>
        </div>

        <Timeline />

        <div className="achievements-section">
          <div className="achievements-wrapper">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
              <div className="achievements-icon-main">
                <Trophy size={64} color="var(--accent)" />
              </div>
              <h2 className="achievements-heading">Level Up Your <span className="text-accent">Civic IQ</span></h2>
              <p className="achievements-subheading">Master the election process and earn exclusive digital badges.</p>
              
              <div className="card-grid achievements-grid">
                {[
                  { icon: <Award />, title: 'Early Voter', desc: 'Verified identity status', color: '#fbbf24' },
                  { icon: <Star />, title: 'Policy Maven', desc: 'EVM mastery certificate', color: '#60a5fa' },
                  { icon: <ShieldCheck />, title: 'Guardian', desc: 'Truth-seeker achievement', color: '#34d399' }
                ].map((badge, i) => (
                  <div key={i} className="badge-card" style={{ '--card-color': badge.color }}>
                    <div className="badge-card-icon">{React.cloneElement(badge.icon, { size: 48 })}</div>
                    <h4 className="badge-card-title">{badge.title}</h4>
                    <p className="badge-card-desc">{badge.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="achievements-cta">
                <Link to="/quiz" className="btn btn-primary achievements-btn">Start Certification Quiz</Link>
              </div>
            </motion.div>
          </div>
          <div className="achievements-blob"></div>
        </div>

        <div className="truth-section">
          <h2 className="section-title">Truth & Clarity</h2>
          <div className="fact-grid">
            <motion.div whileHover={{ scale: 1.02 }} className="myth-card">
              <div className="myth-fact-header myth">
                <AlertTriangle size={28} /> POPULAR MYTH
              </div>
              <p className="truth-text myth-text">"Your vote is not secret and can be traced back to you by the government."</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="fact-card">
              <div className="myth-fact-header fact">
                <CheckCircle2 size={28} /> VERIFIED FACT
              </div>
              <p className="truth-text fact-text">"The secrecy of the ballot is legally protected. No machine or official can identify who you voted for."</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
