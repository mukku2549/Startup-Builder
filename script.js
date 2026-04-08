async function fetchIdeas() {
  try {
    const response = await fetch('https://dummyjson.com/posts?limit=100');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.body,
      tags: post.tags,
    }));
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    throw error;
  }
}

async function fetchRandomIdea() {
  try {
    const randomId = Math.floor(Math.random() * 150) + 1;
    const response = await fetch(`https://dummyjson.com/posts/${randomId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const post = await response.json();
    return {
      id: post.id,
      title: post.title,
      description: post.body,
      tags: post.tags,
    };
  } catch (error) {
    console.error("Failed to fetch random idea:", error);
    throw error;
  }
}

const ThemeManager = {
  theme: 'light',
  init() {
    this.theme = localStorage.getItem('VenlyTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.applyTheme(this.theme);
  },
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('VenlyTheme', this.theme);
    this.applyTheme(this.theme);
  },
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
      icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
  }
};
ThemeManager.init();

class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: '9999'
    });
    document.body.appendChild(this.container);
  }

  show(message, type = 'success', duration = 3000) {
    const toastElem = document.createElement('div');
    Object.assign(toastElem.style, {
      padding: '0.75rem 1.25rem',
      backgroundColor: 'var(--surface)',
      color: 'var(--text-main)',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      border: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontFamily: 'inherit',
      fontWeight: '500',
      transform: 'translateY(100%)',
      opacity: '0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    const isSuccess = type === 'success';
    const iconColor = isSuccess ? '#6366F1' : '#EF4444';

    toastElem.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background-color: ${iconColor}; color: white;">
        <i data-lucide="${isSuccess ? 'check' : 'alert-circle'}" style="width: 14px; height: 14px;"></i>
      </div>
      <span>${message}</span>
    `;

    this.container.appendChild(toastElem);

    if (window.lucide) {
      window.lucide.createIcons({ root: toastElem });
    }

    requestAnimationFrame(() => {
      toastElem.style.transform = 'translateY(0)';
      toastElem.style.opacity = '1';
    });

    setTimeout(() => {
      toastElem.style.opacity = '0';
      toastElem.style.transform = 'translateY(100%)';
      setTimeout(() => {
        if (this.container.contains(toastElem)) {
          this.container.removeChild(toastElem);
        }
      }, 300);
    }, duration);
  }

  success(message) { this.show(message, 'success'); }
  error(message) { this.show(message, 'error'); }
}

const toast = new ToastManager();

class Store {
  constructor() {
    this.favorites = [];
    this.listeners = [];
    this.loadFavorites();
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem('VenlyFavorites');
      this.favorites = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse favorites", e);
      this.favorites = [];
    }
  }

  saveFavorites() {
    localStorage.setItem('VenlyFavorites', JSON.stringify(this.favorites));
    this.notify();
  }

  addFavorite(idea) {
    if (!this.favorites.find(fav => fav.id === idea.id)) {
      this.favorites.push(idea);
      this.saveFavorites();
    }
  }

  removeFavorite(id) {
    this.favorites = this.favorites.filter(fav => fav.id !== id);
    this.saveFavorites();
  }

  isFavorite(id) {
    return this.favorites.some(fav => fav.id === id);
  }

  getFavorites() {
    return [...this.favorites];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.favorites));
  }
}

const store = new Store();

function renderNavbar(container) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <div class="nav-wrapper">
          <div>
            <a href="#/" class="nav-brand">
              <i data-lucide="lightbulb" style="width: 24px; height: 24px;"></i>
              <span>Venly</span>
            </a>
          </div>
          
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="nav-links">
              <a href="#/" class="nav-link active">Home</a>
              <a href="#/explore" class="nav-link">Explore</a>
              <a href="#/generate" class="nav-link">Generate</a>
              <a href="#/favorites" class="nav-link">Favorites</a>
            </div>
            
            <button id="theme-toggle" aria-label="Toggle theme" style="padding: 0.5rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="moon" style="width: 20px; height: 20px;"></i>
            </button>
            
            <div class="mobile-menu-btn">
              <button aria-label="Menu" style="padding: 0.5rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="menu" style="width: 24px; height: 24px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

function renderIdeaCard(idea) {
  const cardOuter = document.createElement('div');
  cardOuter.className = 'animate-fade-in-up';

  const card = document.createElement('div');
  card.className = 'card';

  const isFav = store.isFavorite(idea.id);
  const tagsHtml = idea.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || '';

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${idea.title}</h3>
      <button class="fav-btn ${isFav ? 'active' : ''}" aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
        <i data-lucide="heart" ${isFav ? 'fill="currentColor"' : ''} style="width: 20px; height: 20px;"></i>
      </button>
    </div>
    <p class="card-desc">${idea.description}</p>
    <div class="card-tags">
      ${tagsHtml}
    </div>
  `;

  const favBtn = card.querySelector('.fav-btn');
  const favIcon = card.querySelector('i[data-lucide="heart"]');

  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (store.isFavorite(idea.id)) {
      store.removeFavorite(idea.id);
      toast.success('Removed from favorites');
      favBtn.classList.remove('active');
      favBtn.setAttribute('aria-label', 'Save to favorites');
      favIcon.removeAttribute('fill');
    } else {
      store.addFavorite(idea);
      toast.success('Saved to favorites');
      favBtn.classList.add('active');
      favBtn.setAttribute('aria-label', 'Remove from favorites');
      favIcon.setAttribute('fill', 'currentColor');
    }

    if (window.lucide) {
      window.lucide.createIcons(!window.lucide.refresh ? {} : undefined);
    }
  });

  cardOuter.appendChild(card);
  return cardOuter;
}

function HomeView(container) {
  container.innerHTML = `
    <div class="page-container hero-section">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="hero-content">
        <div class="hero-badge animate-fade-in-up">
          <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
          <span>Discover, Generate & Save</span>
        </div>
        
        <h1 class="hero-title animate-fade-in-up">
          Build Your <span class="text-gradient">Next Venly</span> Idea
        </h1>
        
        <p class="hero-subtitle animate-fade-in-up animation-delay-150">
          Stuck trying to find what to build? Venly is your brainstorming platform to discover curated concepts or generate random inspiration to kickstart your journey.
        </p>
        
        <div class="hero-actions animate-fade-in-up animation-delay-300">
          <a href="#/explore" class="btn btn-primary" style="width: 100%; max-width: 200px; display: inline-flex;">
            <i data-lucide="compass" style="width: 20px; height: 20px;"></i>
            Explore Ideas
          </a>
          <a href="#/generate" class="btn btn-secondary" style="width: 100%; max-width: 220px; display: inline-flex;">
            <i data-lucide="rocket" color="var(--primary)" style="width: 20px; height: 20px;"></i>
            Generate Random
          </a>
        </div>
      </div>
    </div>
  `;
}

function ExploreView(container) {
  let ideas = [];
  let loading = true;
  let error = null;
  let searchTerm = '';
  let selectedTag = 'All';
  let sortAscending = true;

  container.innerHTML = `
    <div class="page-container container" id="explore-container">
      <div class="loader-container">
        <i data-lucide="loader-2" style="width: 40px; height: 40px; color: var(--primary);" class="animate-spin"></i>
      </div>
    </div>
  `;

  const root = container.querySelector('#explore-container');

  const renderContent = () => {
    if (loading) {
      root.innerHTML = `
        <div class="loader-container">
          <i data-lucide="loader-2" style="width: 40px; height: 40px; color: var(--primary);" class="animate-spin"></i>
        </div>
      `;
      return;
    }

    if (error) {
      root.innerHTML = `
        <div class="page-container flex-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <p style="color: #EF4444; font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">${error}</p>
          <button id="retry-btn" class="btn btn-primary">Retry</button>
        </div>
      `;
      root.querySelector('#retry-btn').addEventListener('click', loadData);
      return;
    }

    const allTagsSet = new Set();
    ideas.forEach(idea => idea.tags?.forEach(tag => allTagsSet.add(tag)));
    const allTags = ['All', ...Array.from(allTagsSet).sort()];

    const filteredIdeas = ideas.filter(idea =>
      (selectedTag === 'All' || idea.tags?.includes(selectedTag)) &&
      idea.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortAscending ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });

    root.innerHTML = `
      <div class="text-center" style="margin-bottom: 2.5rem;">
        <h1 class="font-extrabold" style="font-size: 2.25rem; margin-bottom: 1rem; letter-spacing: -0.025em;">Explore Venly concepts</h1>
        <p class="text-muted" style="font-size: 1.125rem; max-width: 42rem; margin: 0 auto;">Browse through hundreds of curated ideas, tailor your search to fix specific niches, and find your next big venture.</p>
      </div>

      <div class="filter-bar">
        <div class="search-input-wrapper">
          <i data-lucide="search" style="width: 20px; height: 20px;" class="search-icon"></i>
          <input type="text" id="search-input" class="search-input" placeholder="Search ideas by title..." value="${searchTerm}" />
        </div>

        <div class="filter-controls">
          <div class="select-wrapper">
            <i data-lucide="filter" style="width: 20px; height: 20px; color: var(--text-muted);"></i>
            <select id="filter-select" class="filter-select">
              ${allTags.map(tag => `<option value="${tag}" ${tag === selectedTag ? 'selected' : ''}>${tag}</option>`).join('')}
            </select>
          </div>
          
          <button id="sort-btn" class="sort-btn">
            <i data-lucide="arrow-down-a-z" style="width: 20px; height: 20px; transform: ${sortAscending ? 'none' : 'rotate(180deg)'}; transition: transform 0.2s;"></i>
            <span>Sort A-Z</span>
          </button>
        </div>
      </div>

      ${filteredIdeas.length === 0 ? `
        <div class="empty-state">
          <p class="text-muted" style="font-size: 1.125rem; margin-bottom: 1rem;">No ideas found matching your criteria.</p>
          <button id="clear-filters-btn" class="btn btn-secondary">Clear Filters</button>
        </div>
      ` : `
        <div class="grid" id="ideas-grid"></div>
      `}
    `;

    const searchInput = root.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderContent();
      });
      setTimeout(() => searchInput.focus(), 0);
    }

    const filterSelect = root.querySelector('#filter-select');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        selectedTag = e.target.value;
        renderContent();
      });
    }

    const sortBtn = root.querySelector('#sort-btn');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        sortAscending = !sortAscending;
        renderContent();
      });
    }

    const clearFiltersBtn = root.querySelector('#clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        searchTerm = '';
        selectedTag = 'All';
        renderContent();
      });
    }

    const grid = root.querySelector('#ideas-grid');
    if (grid) {
      filteredIdeas.forEach(idea => {
        grid.appendChild(renderIdeaCard(idea));
      });
    }

    if (window.lucide) { window.lucide.createIcons(); }
  };

  const loadData = async () => {
    loading = true; error = null; renderContent();
    try {
      ideas = await fetchIdeas();
    } catch (err) {
      error = 'Failed to load ideas. Please try again later.';
    } finally {
      loading = false; renderContent();
    }
  };

  loadData();
}

function GenerateView(container) {
  let idea = null;
  let loading = false;

  container.innerHTML = `
    <div class="page-container container" style="display: flex; flex-direction: column; align-items: center;" id="generate-container">
    </div>
  `;

  const root = container.querySelector('#generate-container');

  const renderContent = () => {
    root.innerHTML = `
      <div class="text-center" style="margin-bottom: 3rem; max-width: 42rem;">
        <h1 class="font-extrabold" style="font-size: 2.25rem; margin-bottom: 1rem; letter-spacing: -0.025em;">Feeling Lucky?</h1>
        <p class="text-muted" style="font-size: 1.125rem;">Click the button below to randomly generate a Venly concept from our vast database.</p>
      </div>

      <button id="generate-btn" ${loading ? 'disabled' : ''} class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.125rem; margin-bottom: 4rem;">
        ${loading
        ? `<i data-lucide="loader-2" style="width: 24px; height: 24px;" class="animate-spin"></i> <span>Generating...</span>`
        : `<i data-lucide="dices" style="width: 24px; height: 24px;"></i> <span>Generate Idea</span>`
      }
      </button>

      <div style="width: 100%; max-width: 42rem;" id="idea-slot">
        ${!idea ? `
          <div class="generate-placeholder">
            <div class="empty-icon-wrap" style="background-color: var(--surface);">
              <i data-lucide="dices" style="width: 32px; height: 32px; color: var(--text-light);"></i>
            </div>
            <p style="color: var(--text-muted); font-weight: 500; font-size: 1.125rem; text-align: center;">
              Your generated idea will appear here.
            </p>
          </div>
        ` : ''}
      </div>
    `;

    root.querySelector('#generate-btn').addEventListener('click', async () => {
      loading = true; renderContent();
      try {
        idea = await fetchRandomIdea();
      } catch (err) {
        toast.error('Failed to generate idea. Try again.');
      } finally {
        loading = false; renderContent();
      }
    });

    if (idea) {
      const slot = root.querySelector('#idea-slot');
      slot.innerHTML = '';
      slot.appendChild(renderIdeaCard(idea));
    }

    if (window.lucide) { window.lucide.createIcons(); }
  };

  renderContent();
}

function FavoritesView(container) {
  container.innerHTML = `<div class="page-container container" id="favorites-container"></div>`;
  const root = container.querySelector('#favorites-container');
  let unsubscribe;

  const renderContent = () => {
    const favorites = store.getFavorites();

    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.5rem; margin-bottom: 2.5rem; border-bottom: 1px solid var(--border);">
        <div>
          <h1 class="font-extrabold" style="display: flex; align-items: center; gap: 0.75rem; font-size: 2.25rem; letter-spacing: -0.025em;">
            <i data-lucide="heart" style="width: 32px; height: 32px; color: var(--primary);" fill="var(--primary)"></i>
            Your Favorites
          </h1>
          <p class="text-muted" style="font-size: 1.125rem; margin-top: 0.5rem;">Ideas you've saved to revisit later.</p>
        </div>
        
        ${favorites.length > 0 ? `
          <div style="background-color: var(--surface); padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 700; color: var(--badge-text); border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
            ${favorites.length} ${favorites.length === 1 ? 'Idea' : 'Ideas'} Saved
          </div>
        ` : ''}
      </div>

      ${favorites.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon-wrap" style="background-color: var(--bg-color); width: 6rem; height: 6rem;">
            <i data-lucide="heart" style="width: 40px; height: 40px; color: var(--text-light);"></i>
          </div>
          <h3 class="font-bold" style="font-size: 1.5rem; margin-bottom: 0.5rem;">No favorites yet!</h3>
          <p class="text-muted" style="font-size: 1.125rem; margin-bottom: 2rem; max-width: 28rem; text-align: center;">Start exploring or generating new startup concepts and save the ones you love.</p>
          <a href="#/explore" class="btn btn-primary" style="padding: 1rem 2rem; display: inline-flex;">
            <i data-lucide="home" style="width: 20px; height: 20px;"></i>
            Go to Explore
          </a>
        </div>
      ` : `
        <div class="grid" id="favorites-grid"></div>
      `}
    `;

    if (favorites.length > 0) {
      const grid = root.querySelector('#favorites-grid');
      favorites.forEach(idea => {
        grid.appendChild(renderIdeaCard(idea));
      });
    }

    if (window.lucide) { window.lucide.createIcons(); }
  };

  unsubscribe = store.subscribe(() => {
    if (!document.body.contains(root)) {
      unsubscribe();
      return;
    }
    renderContent();
  });

  renderContent();
}

class Router {
  constructor(routes, rootElementId) {
    this.routes = routes;
    this.rootElement = document.getElementById(rootElementId);
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    if (!window.location.hash) window.location.hash = '#/';
    else this.handleRoute();
  }

  handleRoute() {
    const path = window.location.hash.slice(1) || '/';
    const viewFactory = this.routes[path] || this.routes['/'];
    if (viewFactory) {
      this.rootElement.innerHTML = '';
      viewFactory(this.rootElement);
      this.updateNavbarActiveState(path);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  updateNavbarActiveState(currentPath) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').replace('#', '');
      if (linkPath === currentPath) link.classList.add('active');
      else link.classList.remove('active');
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('root');
  appElement.className = 'app-container';
  appElement.innerHTML = `
    <div id="navbar-container"></div>
    <main class="main-content" id="main-content"></main>
  `;

  renderNavbar(document.getElementById('navbar-container'));
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => ThemeManager.toggle());
    ThemeManager.applyTheme(ThemeManager.theme);
  }

  const routes = {
    '/': HomeView,
    '/explore': ExploreView,
    '/generate': GenerateView,
    '/favorites': FavoritesView
  };

  const router = new Router(routes, 'main-content');
  router.init();
});
