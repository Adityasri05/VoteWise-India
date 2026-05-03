import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      let msg = err.message;
      if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password.';
      else if (msg.includes('auth/email-already-in-use')) msg = 'Email is already registered.';
      else if (msg.includes('auth/weak-password')) msg = 'Password must be at least 6 characters.';
      else if (msg.includes('auth/invalid-email')) msg = 'Invalid email format.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      console.error('Google Auth error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="premium-auth-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="premium-auth-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="premium-auth-modal"
          >
            {/* Left Decorative Side */}
            <div className="premium-auth-left">
              <div className="auth-left-content">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="auth-brand"
                >
                  <div className="auth-logo-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22L2 12L12 2L22 12L12 22Z" fill="url(#paint0_linear)"/>
                      <defs>
                        <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#3b82f6"/>
                          <stop offset="1" stopColor="#10b981"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h2>VoteWise India</h2>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="auth-tagline"
                >
                  <h2>{isLogin ? 'Welcome back to the future of democracy.' : 'Join the movement for smarter voting.'}</h2>
                  <p>Empowering citizens with AI-driven insights, candidate comparisons, and reliable electoral information.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="auth-features-list"
                >
                  <div className="auth-feature-item">
                    <ShieldCheck size={20} className="feature-icon" />
                    <span>Secure & Private Access</span>
                  </div>
                  <div className="auth-feature-item">
                    <Zap size={20} className="feature-icon" />
                    <span>Instant AI Assistance</span>
                  </div>
                  <div className="auth-feature-item">
                    <User size={20} className="feature-icon" />
                    <span>Personalized Civic Dashboard</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Background Elements */}
              <div className="auth-bg-shapes">
                <div className="auth-shape shape-1"></div>
                <div className="auth-shape shape-2"></div>
              </div>
            </div>

            {/* Right Form Side */}
            <div className="premium-auth-right">
              <button onClick={onClose} className="premium-auth-close">
                <X size={24} />
              </button>

              <div className="premium-auth-header">
                <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <p>{isLogin ? 'Access your personalized election toolkit.' : 'Get started with your free VoteWise account.'}</p>
              </div>

              <div className="premium-auth-body">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="premium-auth-error"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="premium-auth-form">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      >
                        <div className="premium-input-group">
                          <User size={20} className="input-icon" />
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required={!isLogin}
                            className="premium-input"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="premium-input-group">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="premium-input"
                    />
                  </div>

                  <div className="premium-input-group">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="premium-input"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="premium-submit-btn"
                  >
                    {loading ? <Loader2 size={20} className="spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </form>

                <div className="premium-auth-divider">
                  <span>or continue with</span>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="premium-google-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <div className="premium-auth-footer">
                  <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="premium-toggle-btn"
                    >
                      {isLogin ? 'Create one now' : 'Sign in instead'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
