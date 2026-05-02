import React from 'react';
import { HelpCircle, Phone, Mail, FileText, AlertCircle, Search } from 'lucide-react';

const HelpCenter = () => {
  const faqs = [
    { q: "How do I check if my name is in the voter list?", a: "You can visit the ECI Electoral Search portal (electoralsearch.eci.gov.in) and search by your details or EPIC number." },
    { q: "What if I lost my physical Voter ID card?", a: "You can download a digital e-EPIC from the Voters Service Portal or show any other valid photo identity proof at the polling booth." },
    { q: "Can I register to vote if I am 17 years old?", a: "Yes, you can apply in advance if you are 17+ so that your name is added as soon as you turn 18 on the qualifying date." },
    { q: "Is there any helpline number for voter queries?", a: "Yes, you can call the Voter Helpline at 1950 (toll-free) for any assistance." }
  ];

  return (
    <div style={{ padding: '4rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Help Center & Support</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem' }}>Find answers to common questions or reach out for official assistance.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <Phone size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>1950 Helpline</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Official toll-free helpline for all voter related queries.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertCircle size={32} color="var(--error)" style={{ marginBottom: '1rem' }} />
          <h3>File a Complaint</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Report issues related to polling booths or electoral rolls.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <Mail size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h3>Email Support</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Contact the District Election Officer via email.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <HelpCircle color="var(--primary)" /> Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i !== faqs.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>{faq.q}</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '4rem', background: '#f8fafc', padding: '2.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <FileText size={40} color="var(--primary)" />
        </div>
        <div>
          <h3>Still need help?</h3>
          <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.7 }}>Download our comprehensive "Voter Guide PDF" which covers everything in detail.</p>
          <button className="btn btn-primary">Download Guide</button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
