import React, { useState } from 'react';
import { fetchRandomIdea } from '../services/api';
import IdeaCard from '../components/IdeaCard';
import { Dices, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Generate = () => {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateNewIdea = async () => {
    setLoading(true);
    try {
      const newIdea = await fetchRandomIdea();
      setIdea(newIdea);
    } catch (err) {
      toast.error('Failed to generate idea. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="text-center" style={{ marginBottom: '3rem', maxWidth: '42rem' }}>
        <h1 className="font-extrabold" style={{ fontSize: '2.25rem', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Feeling Lucky?</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>Click the button below to randomly generate a startup concept from our vast database.</p>
      </div>

      <button
        onClick={generateNewIdea}
        disabled={loading}
        className="btn btn-primary"
        style={{ padding: '1rem 2rem', fontSize: '1.125rem', marginBottom: '4rem' }}
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Dices size={24} />}
        <span>{loading ? 'Generating...' : 'Generate Idea'}</span>
      </button>

      <div style={{ width: '100%', maxWidth: '42rem' }}>
        {idea ? (
          <div className="animate-fade-in-up">
            <IdeaCard idea={idea} />
          </div>
        ) : (
          <div className="generate-placeholder">
            <div className="empty-icon-wrap" style={{ backgroundColor: 'white' }}>
              <Dices size={32} color="var(--text-light)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.125rem', textAlign: 'center' }}>
              Your generated idea will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
