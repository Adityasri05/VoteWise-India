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
    <div className="quiz-container">
      <AnimatePresence mode="wait">
        {showScore ? (
          <motion.div 
            key="score"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card score-card" 
          >
            <Trophy size={80} color="var(--accent)" />
            <h1>Certification Complete!</h1>
            <p className="score-summary">
              You scored <span>{score}</span> out of {questions.length}
            </p>
            
            <div className="score-badge-container">
              {score >= 3 ? (
                <div className="score-badge">
                  <Award size={40} color="var(--accent)" />
                  <h4>Civic Scholar</h4>
                </div>
              ) : (
                <div className="score-badge">
                  <HelpCircle size={40} color="#60a5fa" />
                  <h4>Active Learner</h4>
                </div>
              )}
            </div>

            <button className="btn quiz-reset-btn" onClick={resetQuiz}>
              <RotateCcw size={20} /> Retake Quiz
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card quiz-card" 
          >
            <div className="quiz-header">
              <span className="quiz-step-text">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="quiz-progress-container">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  className="quiz-progress-bar"
                />
              </div>
            </div>

            <h2 className="quiz-question-text">{questions[currentQuestion].questionText}</h2>
            
            <div className="quiz-options-list">
              {questions[currentQuestion].answerOptions.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={selectedAnswer === null ? { x: 10 } : {}}
                  onClick={() => handleAnswerClick(index, option.isCorrect)}
                  className={`quiz-option-button ${
                    selectedAnswer === index 
                      ? (option.isCorrect ? 'correct' : 'incorrect') 
                      : ''
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  <span>{option.answerText}</span>
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
