import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, UserPlus, Search, Edit3, CreditCard, ChevronRight, ArrowRight, X } from 'lucide-react';

const VoterProcess = () => {
  const [showDocsModal, setShowDocsModal] = useState(false);
  const steps = [
    {
      id: 'eligibility',
      title: 'Check Your Eligibility',
      icon: <CheckCircle2 size={34} />,
      desc: 'To be a voter, you must be an Indian citizen, 18 years of age on the qualifying date (1st Jan, 1st April, 1st July, or 1st Oct), and ordinarily resident in the polling area.',
      link: 'https://voters.eci.gov.in/',
      linkText: 'Check Criteria',
      color: '#3b82f6'
    },
    {
      id: 'registration',
      title: 'Register as a New Voter',
      icon: <UserPlus size={34} />,
      desc: 'Fill Form 6 on the Voters Service Portal (VSP). You will need a passport-sized photo, age proof, and residence proof for a seamless experience.',
      link: 'https://voters.eci.gov.in/registration-details-form6',
      linkText: 'Fill Form 6',
      color: '#10b981'
    },
    {
      id: 'correction',
      title: 'Correct or Update Details',
      icon: <Edit3 size={34} />,
      desc: 'Is there a mistake in your Voter ID? Use Form 8 for correction of entries, shifting of residence, or replacement of your EPIC card.',
      link: 'https://voters.eci.gov.in/registration-details-form8',
      linkText: 'Update Details',
      color: '#f59e0b'
    },
    {
      id: 'voter-id',
      title: 'Download digital e-EPIC',
      icon: <Download size={34} />,
      desc: 'Registered voters can download a digital version of their Voter ID which is equally valid for voting at any polling station.',
      link: 'https://voters.eci.gov.in/download-epic',
      linkText: 'Download PDF',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="help-center-container">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="process-header-center">
          <h1 className="section-title">The Voter Journey</h1>
          <p className="process-subtitle">
            A comprehensive, digital-first guide to becoming an active participant in Indian democracy.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="card voter-step-card" 
              style={{ '--card-color': step.color }}
              whileHover={{ y: -10 }}
            >
              <div className="process-card-icon-wrapper">
                {step.icon}
              </div>
              <div className="process-card-content">
                <h3 className="process-card-title">{step.title}</h3>
                <p className="process-card-desc">{step.desc}</p>
                <a 
                  href={step.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary process-card-btn"
                >
                  {step.linkText} <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="voter-hero-card"
        >
          <div className="voter-hero-content">
            <CreditCard size={64} color="var(--primary-accent)" className="voter-hero-icon" />
            <h2 className="voter-hero-title">Voting Without a Physical ID?</h2>
            <p className="voter-hero-text">
              Your democratic right is protected. If your name is in the electoral roll, you can present any of the 12 approved documents including Aadhaar, PAN, or Passport.
            </p>
            <button className="btn voter-hero-btn" onClick={() => setShowDocsModal(true)}>Explore Valid IDs</button>
          </div>
          
          <div className="voter-hero-blob"></div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDocsModal && (
          <div className="drawer-overlay" onClick={() => setShowDocsModal(false)} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card"
              style={{ background: 'white', padding: '2rem', maxWidth: '500px', width: '90%', borderRadius: '16px', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowDocsModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--text-muted)" />
              </button>
              <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Valid ID Documents</h2>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>If you don't have your Voter ID card, you can show any of these 12 approved documents:</p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text)' }}>
                <li>Aadhaar Card</li>
                <li>MGNREGA Job Card</li>
                <li>Passbooks with photograph issued by Bank/Post Office</li>
                <li>Health Insurance Smart Card issued under the scheme of Ministry of Labour</li>
                <li>Driving License</li>
                <li>PAN Card</li>
                <li>Smart Card issued by RGI under NPR</li>
                <li>Indian Passport</li>
                <li>Pension document with photograph</li>
                <li>Service Identity Cards with photograph issued to employees by Central/State Govt/PSUs/Public Limited Companies</li>
                <li>Official identity cards issued to MPs/MLAs/MLCs</li>
                <li>Unique Disability ID (UDID) Card</li>
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoterProcess;
