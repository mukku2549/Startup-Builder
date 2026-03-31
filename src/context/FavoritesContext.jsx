import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem('startupBuilderFavorites');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Failed to parse favorites from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('startupBuilderFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (idea) => {
    setFavorites((prev) => {
      if (prev.find(fav => fav.id === idea.id)) return prev;
      return [...prev, idea];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
