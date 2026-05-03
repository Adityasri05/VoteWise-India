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
    <div className="help-center-container">
      <div className="candidate-header-center">
        <h1 className="section-title">Know Your Candidates</h1>
        <p className="candidate-subtitle">
          Transparent access to candidate profiles, financial disclosures, and legislative track records.
        </p>
      </div>

      <div className="candidate-filters">
        {['All', 'No Criminal Records', 'High Assets', 'Youth Leaders'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            className={`filter-btn ${filter === f.toLowerCase() ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="candidate-grid">
        {candidates.map((candidate, i) => (
          <motion.div 
            key={i} 
            className="card candidate-card" 
            whileHover={{ y: -10 }}
          >
            <div className="candidate-header dynamic" style={{ '--candidate-color': candidate.color }}>
              <div className="candidate-avatar">
                <Users size={40} color="white" />
              </div>
              <h2 className="candidate-name-title">{candidate.name}</h2>
              <div className="candidate-party-label">{candidate.party}</div>
            </div>

            <div className="candidate-body">
              <div className="candidate-info-grid">
                <div className="candidate-info-item">
                  <div className="candidate-info-icon primary"><GraduationCap size={20} /></div>
                  <div>
                    <div className="candidate-info-label">Education</div>
                    <div className="candidate-info-value">{candidate.education}</div>
                  </div>
                </div>
                <div className="candidate-info-item">
                  <div className="candidate-info-icon secondary"><Scale size={20} /></div>
                  <div>
                    <div className="candidate-info-label">Assets</div>
                    <div className="candidate-info-value">{candidate.assets}</div>
                  </div>
                </div>
                <div className="candidate-info-item">
                  <div className="candidate-info-icon dynamic" style={{ '--dynamic-color': candidate.criminalCases > 0 ? 'var(--error)' : 'var(--success)' }}><ShieldAlert size={20} /></div>
                  <div>
                    <div className="candidate-info-label">Criminal Cases</div>
                    <div className="candidate-info-value">{candidate.criminalCases}</div>
                  </div>
                </div>
                <div className="candidate-info-item">
                  <div className="candidate-info-icon accent"><Activity size={20} /></div>
                  <div>
                    <div className="candidate-info-label">Public Rating</div>
                    <div className="candidate-info-value candidate-info-value large">4.8 / 5</div>
                  </div>
                </div>
              </div>

              <div className="candidate-manifesto-box">
                <h4 className="candidate-manifesto-header">
                  <FileText size={18} color="var(--primary)" /> Manifesto Summary
                </h4>
                <p className="candidate-manifesto-text">{candidate.manifesto}</p>
              </div>

              <button className="btn btn-primary candidate-full-btn">
                View Full Affidavit <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="help-cta candidate-compare-cta">
        <div className="candidate-compare-text">
          <h2>Compare Candidates</h2>
          <p>Select two or more candidates to compare their legislative experience and financial disclosures side-by-side.</p>
        </div>
        <button className="btn btn-primary candidate-compare-btn">Launch Comparison Tool</button>
      </div>
    </div>
  );
};

export default CandidateAwareness;
