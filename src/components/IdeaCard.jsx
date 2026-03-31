import React, { useContext } from 'react';
import { Heart } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import toast from 'react-hot-toast';

const IdeaCard = ({ idea }) => {
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(idea.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(idea.id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(idea);
      toast.success('Saved to favorites');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {idea.title}
        </h3>
        <button 
          onClick={handleFavoriteClick}
          className={`fav-btn ${favorite ? 'active' : ''}`}
          aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
        >
          {favorite ? <Heart size={20} fill="currentColor" /> : <Heart size={20} />}
        </button>
      </div>
      
      <p className="card-desc">
        {idea.description}
      </p>
      
      <div className="card-tags">
        {idea.tags && idea.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IdeaCard;
