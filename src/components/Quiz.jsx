import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Star, ShieldCheck, HelpCircle } from 'lucide-react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const questions = [
    {
      questionText: 'What is the minimum age to register as a voter in India?',
      answerOptions: [
        { answerText: '16 years', isCorrect: false },
        { answerText: '18 years', isCorrect: true },
        { answerText: '21 years', isCorrect: false },
        { answerText: '25 years', isCorrect: false },
      ],
    },
    {
      questionText: 'Which document is NOT required for voter registration?',
      answerOptions: [
        { answerText: 'Passport size photo', isCorrect: false },
        { answerText: 'Address proof', isCorrect: false },
        { answerText: 'Birth certificate', isCorrect: false },
        { answerText: 'Property ownership papers', isCorrect: true },
      ],
    },
    {
      questionText: 'What does VVPAT stand for?',
      answerOptions: [
        { answerText: 'Voter Verified Paper Audit Trail', isCorrect: true },
        { answerText: 'Voter Verifiable Password Audit Tool', isCorrect: false },
        { answerText: 'Voter Verified Paper Account Trail', isCorrect: false },
        { answerText: 'Voter Valued Paper Audit Trail', isCorrect: false },
      ],
    },
    {
      questionText: 'Can an Indian citizen living abroad register to vote?',
      answerOptions: [
        { answerText: 'No, only residents can vote', isCorrect: false },
        { answerText: 'Yes, as an Overseas (NRI) Voter', isCorrect: true },
        { answerText: 'Only if they have a local address', isCorrect: false },
        { answerText: 'Only if they are government officials', isCorrect: false },
      ],
    }
  ];

  const handleAnswerClick = (index, isCorrect) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setIsCorrect(isCorrect);
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div style={{ padding: '6rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <AnimatePresence mode="wait">
        {showScore ? (
          <motion.div 
            key="score"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card" 
            style={{ textAlign: 'center', padding: '5rem 3rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)', color: 'white' }}
          >
            <Trophy size={80} color="var(--accent)" style={{ marginBottom: '2rem' }} />
            <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>Certification Complete!</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '3rem' }}>
              You scored <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '2rem' }}>{score}</span> out of {questions.length}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
              {score >= 3 ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Award size={40} color="var(--accent)" />
                  <h4 style={{ color: 'white', marginTop: '1rem' }}>Civic Scholar</h4>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <HelpCircle size={40} color="#60a5fa" />
                  <h4 style={{ color: 'white', marginTop: '1rem' }}>Active Learner</h4>
                </div>
              )}
            </div>

            <button className="btn btn-primary" onClick={resetQuiz} style={{ background: 'white', color: 'var(--primary)', padding: '1rem 3rem' }}>
              <RotateCcw size={20} /> Retake Quiz
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card" 
            style={{ padding: '4rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div style={{ width: '150px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  style={{ height: '100%', background: 'var(--primary-accent)' }}
                />
              </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem', lineHeight: '1.4' }}>{questions[currentQuestion].questionText}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions[currentQuestion].answerOptions.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 10 }}
                  onClick={() => handleAnswerClick(index, option.isCorrect)}
                  style={{
                    padding: '1.5rem 2rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: selectedAnswer === index 
                      ? (option.isCorrect ? '#d1fae5' : '#fee2e2')
                      : 'white',
                    color: 'var(--text)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: selectedAnswer === null ? 'pointer' : 'default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    borderColor: selectedAnswer === index 
                      ? (option.isCorrect ? '#10b981' : '#ef4444')
                      : 'var(--border)'
                  }}
                >
                  {option.answerText}
                  {selectedAnswer === index && (
                    option.isCorrect ? <CheckCircle2 color="#10b981" /> : <XCircle color="#ef4444" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
