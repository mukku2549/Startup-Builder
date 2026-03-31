import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import IdeaCard from '../components/IdeaCard';
import { Heart, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  return (
    <div className="page-container container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 className="font-extrabold" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', letterSpacing: '-0.025em' }}>
            <Heart size={32} color="var(--primary)" fill="var(--primary)" />
            Your Favorites
          </h1>
          <p className="text-muted" style={{ fontSize: '1.125rem', marginTop: '0.5rem' }}>Ideas you've saved to revisit later.</p>
        </div>
        
        {favorites.length > 0 && (
          <div style={{ backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 700, color: '#4338CA', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {favorites.length} {favorites.length === 1 ? 'Idea' : 'Ideas'} Saved
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap" style={{ backgroundColor: 'var(--bg-color)', width: '6rem', height: '6rem' }}>
            <Heart size={40} color="var(--text-light)" />
          </div>
          <h3 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No favorites yet!</h3>
          <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '28rem', textAlign: 'center' }}>Start exploring or generating new startup concepts and save the ones you love.</p>
          <button 
            onClick={() => navigate('/explore')}
            className="btn btn-primary"
            style={{ padding: '1rem 2rem' }}
          >
            <Home size={20} />
            Go to Explore
          </button>
        </div>
      ) : (
        <div className="grid">
          {favorites.map(idea => (
            <div key={idea.id} className="animate-fade-in-up">
              <IdeaCard idea={idea} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
