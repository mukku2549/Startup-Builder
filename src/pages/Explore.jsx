import React, { useState, useEffect, useMemo } from 'react';
import { fetchIdeas } from '../services/api';
import IdeaCard from '../components/IdeaCard';
import { Search, Filter, ArrowDownAZ, Loader2 } from 'lucide-react';

const Explore = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const fetched = await fetchIdeas();
        setIdeas(fetched);
      } catch (err) {
        setError('Failed to load ideas. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadIdeas();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    ideas.forEach(idea => idea.tags?.forEach(tag => tags.add(tag)));
    return ['All', ...Array.from(tags).sort()];
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas
      .filter(idea => 
        (selectedTag === 'All' || idea.tags?.includes(selectedTag)) &&
        idea.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortAscending ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      });
  }, [ideas, searchTerm, selectedTag, sortAscending]);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 size={40} color="var(--primary)" className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#EF4444', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container container">
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <h1 className="font-extrabold" style={{ fontSize: '2.25rem', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Explore startup concepts</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>Browse through hundreds of curated ideas, tailor your search to fix specific niches, and find your next big venture.</p>
      </div>
      
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search ideas by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="select-wrapper">
            <Filter size={20} color="var(--text-muted)" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="sort-btn"
          >
            <ArrowDownAZ size={20} style={{ transform: sortAscending ? 'none' : 'rotate(180deg)' }} />
            <span>Sort A-Z</span>
          </button>
        </div>
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="empty-state">
          <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>No ideas found matching your criteria.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filteredIdeas.map(idea => (
            <div key={idea.id} className="animate-fade-in-up">
              <IdeaCard idea={idea} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
