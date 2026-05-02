import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Megaphone, CheckCircle2, Award, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Timeline = () => {
  const { t } = useLanguage();
  const events = [
    { date: 'Oct 2025', title: t.event1Title, desc: t.event1Desc, icon: <Flag />, status: 'completed' },
    { date: 'Nov 2025', title: t.event2Title, desc: t.event2Desc, icon: <Calendar />, status: 'completed' },
    { date: 'Dec 2025', title: t.event3Title, desc: t.event3Desc, icon: <Megaphone />, status: 'current' },
    { date: 'Jan 15, 2026', title: t.event4Title, desc: t.event4Desc, icon: <CheckCircle2 />, status: 'upcoming' },
    { date: 'Jan 20, 2026', title: t.event5Title, desc: t.event5Desc, icon: <Award />, status: 'upcoming' }
  ];

  return (
    <div style={{ margin: '8rem 0' }}>
      <h2 className="section-title">{t.cycleTitle}</h2>
      <div style={{ position: 'relative', maxWidth: '1000px', margin: '6rem auto 0', padding: '0 2rem' }}>
        {/* Progress Line */}
        <div style={{ 
          position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', 
          background: 'var(--border)', transform: 'translateY(-50%)', zIndex: 0 
        }}>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '55%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ height: '100%', background: 'var(--primary-accent)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {events.map((event, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center', width: '150px' }}
            >
              <div style={{ 
                width: '64px', height: '64px', 
                background: event.status === 'upcoming' ? 'white' : 'var(--primary-accent)',
                color: event.status === 'upcoming' ? 'var(--text-muted)' : 'white',
                borderRadius: '50%', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: event.status === 'upcoming' ? '2px solid var(--border)' : 'none',
                boxShadow: event.status === 'current' ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none',
                position: 'relative'
              }}>
                {React.cloneElement(event.icon, { size: 28 })}
                {event.status === 'current' && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-accent)', zIndex: -1 }}
                  />
                )}
              </div>
              <div style={{ fontWeight: 800, color: event.status === 'upcoming' ? 'var(--text-muted)' : 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{event.date}</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: event.status === 'upcoming' ? 'var(--text-muted)' : 'var(--primary)' }}>{event.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '6rem', background: 'rgba(59, 130, 246, 0.05)', padding: '2rem', 
        borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem',
        border: '1px solid rgba(59, 130, 246, 0.1)', maxWidth: '800px', margin: '6rem auto 0'
      }}>
        <div style={{ background: 'white', padding: '0.8rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
          <Info size={24} color="var(--primary-accent)" />
        </div>
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          <span style={{ fontWeight: 800, color: 'var(--primary-accent)' }}>{t.liveUpdateLabel}</span> {t.liveUpdateText}
        </p>
      </div>
    </div>
  );
};

export default Timeline;
