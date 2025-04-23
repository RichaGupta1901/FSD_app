import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/AboutUs.css';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your portfolio and provide personalized insights.',
      icon: '🤖'
    },
    {
      title: 'Real-Time Market Data',
      description: 'Stay updated with live market trends and make informed investment decisions.',
      icon: '📊'
    },
    {
      title: 'Smart Portfolio Management',
      description: 'Effortlessly manage and track your investments across multiple platforms.',
      icon: '💼'
    },
    {
      title: 'Predictive Analytics',
      description: 'Get future market predictions based on historical data and market patterns.',
      icon: '🎯'
    }
  ];

  return (
    <div className="about-container">
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to FinVision</h1>
        <p>Your AI-Powered Financial Companion</p>
      </motion.section>

      <motion.section 
        className="mission-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2>Our Mission</h2>
        <p>
          At FinVision, we're revolutionizing the way investors manage their portfolios. 
          By combining cutting-edge AI technology with user-friendly interfaces, 
          we empower investors to make smarter, data-driven decisions.
        </p>
      </motion.section>

      <section className="features-section">
        <h2>What Sets Us Apart</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.2 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Ready to Transform Your Investment Journey?</h2>
        <p>Join thousands of investors who are already benefiting from our AI-powered insights.</p>
        <button className="cta-button">Get Started Now</button>
      </motion.section>
      <section className="creators-section">
        <h2>Meet the Creators</h2>
        <div className="creators-grid">
            <div className="creator-card">
            <img src="/richa(2).jpg" alt="Richa Gupta" />
            <h3>Richa Gupta</h3>
            <a href="https://github.com/RichaGupta1901" target="_blank" rel="noopener noreferrer">
                View GitHub
            </a>
            </div>
            <div className="creator-card">
            <img src="https://github.com/creator1.png" alt="Sai Bhujbal" />
            <h3>Sai Bhujbal</h3>
            <a href="https://github.com/SaiBhujbal" target="_blank" rel="noopener noreferrer">
                View GitHub
            </a>
            </div>
            <div className="creator-card">
            <img src="/saharsh.jpg" alt="Saharsh Mehrotra" />
            <h3>Saharsh Mehrotra</h3>
            <a href="https://github.com/saharshmehrotra" target="_blank" rel="noopener noreferrer">
                View GitHub
            </a>
            </div>
            <div className="creator-card">
            <img src="/rahul.jpg" alt="Rahul Purandare" />
            <h3>Rahul Purandare</h3>
            <a href="https://github.com/RahulPurandare44" target="_blank" rel="noopener noreferrer">
                View GitHub
            </a>
            </div>
        </div>
        </section>
    </div>
  );
};

export default AboutUs;