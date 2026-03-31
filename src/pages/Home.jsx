import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Compass } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container hero-section">
      {/* Background decorations */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="hero-content">
        <div className="hero-badge animate-fade-in-up">
          <Sparkles size={16} />
          <span>Discover, Generate & Save</span>
        </div>
        
        <h1 className="hero-title animate-fade-in-up">
          Build Your <span className="text-gradient">Next Startup</span> Idea
        </h1>
        
        <p className="hero-subtitle animate-fade-in-up animation-delay-150">
          Stuck trying to find what to build? Startup Builder is your brainstorming platform to discover curated concepts or generate random inspiration to kickstart your journey.
        </p>
        
        <div className="hero-actions animate-fade-in-up animation-delay-300">
          <button 
            onClick={() => navigate('/explore')}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '200px' }}
          >
            <Compass size={20} />
            Explore Ideas
          </button>
          <button 
            onClick={() => navigate('/generate')}
            className="btn btn-secondary"
            style={{ width: '100%', maxWidth: '220px' }}
          >
            <Rocket size={20} color="var(--primary)" />
            Generate Random
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
