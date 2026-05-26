import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, FileText, AlertCircle, Search } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const faqs = [
    { q: "How do I check if my name is in the voter list?", a: "You can visit the ECI Electoral Search portal (electoralsearch.eci.gov.in) and search by your details or EPIC number." },
    { q: "What if I lost my physical Voter ID card?", a: "You can download a digital e-EPIC from the Voters Service Portal or show any other valid photo identity proof at the polling booth." },
    { q: "Can I register to vote if I am 17 years old?", a: "Yes, you can apply in advance if you are 17+ so that your name is added as soon as you turn 18 on the qualifying date." },
    { q: "Is there any helpline number for voter queries?", a: "Yes, you can call the Voter Helpline at 1950 (toll-free) for any assistance." }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-center-container">
      <h1>Help Center & Support</h1>
      <p className="help-center-subtitle">Find answers to common questions or reach out for official assistance.</p>

      <div className="support-grid">
        <div className="card support-card">
          <Phone size={32} color="var(--primary)" />
          <h3>1950 Helpline</h3>
          <p>Official toll-free helpline for all voter related queries.</p>
        </div>
        <div className="card support-card">
          <AlertCircle size={32} color="var(--error)" />
          <h3>File a Complaint</h3>
          <p>Report issues related to polling booths or electoral rolls.</p>
        </div>
        <div className="card support-card">
          <Mail size={32} color="var(--secondary)" />
          <h3>Email Support</h3>
          <p>Contact the District Election Officer via email.</p>
        </div>
      </div>

      <div className="card faq-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>
            <HelpCircle color="var(--primary)" /> Frequently Asked Questions
          </h2>
          <div className="faq-search-wrapper" style={{ position: 'relative', minWidth: '280px' }}>
            <input 
              type="text" 
              placeholder="Search FAQs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
        <div className="faq-list">
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          )) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No FAQs found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className="help-cta">
        <div className="help-cta-icon-box">
          <FileText size={40} color="var(--primary)" />
        </div>
        <div>
          <h3>Still need help?</h3>
          <p>Download our comprehensive "Voter Guide PDF" which covers everything in detail.</p>
          <button className="btn btn-primary" onClick={() => alert("The comprehensive Voter Guide PDF will be available soon.")}>Download Guide</button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
