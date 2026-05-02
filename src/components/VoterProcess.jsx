import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, UserPlus, Search, Edit3, CreditCard, ChevronRight, ArrowRight } from 'lucide-react';

const VoterProcess = () => {
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
    <div style={{ padding: '6rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="section-title">The Voter Journey</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
            A comprehensive, digital-first guide to becoming an active participant in Indian democracy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem' }}>
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="card" 
              whileHover={{ y: -10 }}
              style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', padding: '3rem' }}
            >
              <div style={{ 
                padding: '1.2rem', 
                background: `${step.color}15`, 
                borderRadius: '24px',
                color: step.color,
                border: `1px solid ${step.color}30`
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{step.title}</h3>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>{step.desc}</p>
                <a 
                  href={step.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', background: step.color, boxShadow: `0 10px 20px -5px ${step.color}40` }}
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
          style={{ 
            marginTop: '8rem', padding: '5rem', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)', 
            color: 'white', borderRadius: '40px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <CreditCard size={64} color="var(--primary-accent)" style={{ marginBottom: '2rem' }} />
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Voting Without a Physical ID?</h2>
            <p style={{ opacity: 0.8, fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '750px', margin: '0 auto 3rem' }}>
              Your democratic right is protected. If your name is in the electoral roll, you can present any of the 12 approved documents including Aadhaar, PAN, or Passport.
            </p>
            <button className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '1rem 3rem' }}>Explore Valid IDs</button>
          </div>
          
          {/* Decorative blur */}
          <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary-accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2 }}></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VoterProcess;
