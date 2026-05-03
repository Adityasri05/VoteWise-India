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
    <div className="section-spacing">
      <h2 className="section-title">{t.cycleTitle}</h2>
      <div className="timeline-container">
        {/* Progress Line */}
        <div className="timeline-line">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '55%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="timeline-progress-fill"
          />
        </div>

        <div className="timeline-steps">
          {events.map((event, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="timeline-step"
            >
              <div className={`timeline-icon-box ${event.status}`}>
                {React.cloneElement(event.icon, { size: 28 })}
                {event.status === 'current' && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="timeline-current-pulse"
                  />
                )}
              </div>
              <div className="timeline-content-box">
                <div className={`timeline-date ${event.status}`}>{event.date}</div>
                <h4 className={`timeline-title ${event.status}`}>{event.title}</h4>
                <p className="timeline-desc">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="timeline-info-banner">
        <div className="timeline-info-icon">
          <Info size={24} color="var(--primary-accent)" />
        </div>
        <p className="timeline-info-text">
          <span className="timeline-info-highlight">{t.liveUpdateLabel}</span> {t.liveUpdateText}
        </p>
      </div>
    </div>
  );
};

export default Timeline;
