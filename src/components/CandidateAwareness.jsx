import React, { useState } from 'react';
import { Users, FileText, BarChart, ShieldAlert, GraduationCap, Scale, ChevronRight, Search, Filter, ExternalLink, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateAwareness = () => {
  const [filter, setFilter] = useState('all');

  const candidates = [
    { 
      name: 'Aditi Sharma', 
      party: 'National Progress Party', 
      education: 'PhD in Economics', 
      assets: '₹5.2 Crores',
      criminalCases: 0,
      manifesto: 'Focus on digital infrastructure and education reform.',
      color: '#3b82f6'
    },
    { 
      name: 'Vikram Singh', 
      party: 'Unity Alliance', 
      education: 'LLB, Delhi University', 
      assets: '₹12.8 Crores',
      criminalCases: 2,
      manifesto: 'Strengthening rural economy and agricultural subsidies.',
      color: '#ef4444'
    },
    { 
      name: 'Meera Deshmukh', 
      party: 'Green Future Party', 
      education: 'MS in Environmental Science', 
      assets: '₹1.5 Crores',
      criminalCases: 0,
      manifesto: 'Sustainable urban planning and renewable energy.',
      color: '#10b981'
    }
  ];

  return (
    <div style={{ padding: '6rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 className="section-title">Know Your Candidates</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Transparent access to candidate profiles, financial disclosures, and legislative track records.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        {['All', 'No Criminal Records', 'High Assets', 'Youth Leaders'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            style={{ 
              padding: '0.8rem 1.8rem', borderRadius: '100px', 
              border: '1px solid var(--border)', background: 'white',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              color: filter === f.toLowerCase() ? 'var(--primary-accent)' : 'var(--text)',
              borderColor: filter === f.toLowerCase() ? 'var(--primary-accent)' : 'var(--border)',
              boxShadow: filter === f.toLowerCase() ? '0 10px 20px rgba(59, 130, 246, 0.1)' : 'none'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {candidates.map((candidate, i) => (
          <motion.div 
            key={i} 
            className="card" 
            whileHover={{ y: -10 }}
            style={{ padding: 0, overflow: 'hidden' }}
          >
            <div style={{ background: `linear-gradient(135deg, ${candidate.color}, ${candidate.color}dd)`, padding: '3rem 2rem', color: 'white', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Users size={50} color="white" />
              </div>
              <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>{candidate.name}</h2>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 700, letterSpacing: '0.05em' }}>{candidate.party}</div>
            </div>

            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary-accent)' }}><GraduationCap size={20} /></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Education</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{candidate.education}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--secondary)' }}><Scale size={20} /></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assets</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{candidate.assets}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: candidate.criminalCases > 0 ? 'var(--error)' : 'var(--success)' }}><ShieldAlert size={20} /></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Criminal Cases</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{candidate.criminalCases}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--accent)' }}><Activity size={20} /></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Public Rating</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>4.8 / 5</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
                <h4 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--primary)" /> Manifesto Summary
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{candidate.manifesto}</p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                View Full Affidavit <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '6rem', padding: '4rem', background: '#f1f5f9', borderRadius: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Compare Candidates</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Select two or more candidates to compare their legislative experience and financial disclosures side-by-side.</p>
        </div>
        <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem 3rem' }}>Launch Comparison Tool</button>
      </div>
    </div>
  );
};

export default CandidateAwareness;
