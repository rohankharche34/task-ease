import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeSelector = () => {
  const [theme, setTheme] = useState('auto');
  const [accent, setAccent] = useState('purple');

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('taskease-theme') || 'auto';
    const savedAccent = localStorage.getItem('taskease-accent') || 'purple';
    
    setTheme(savedTheme);
    setAccent(savedAccent);
    applyTheme(savedTheme);
    applyAccent(savedAccent);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', newTheme);
    }
    localStorage.setItem('taskease-theme', newTheme);
  };

  const applyAccent = (newAccent) => {
    document.documentElement.setAttribute('data-accent', newAccent);
    localStorage.setItem('taskease-accent', newAccent);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleAccentChange = (newAccent) => {
    setAccent(newAccent);
    applyAccent(newAccent);
  };

  // Listen for system theme changes if auto is selected
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <div className="theme-selector">
      <div className="color-picker">
        {['purple', 'emerald', 'rose', 'blue'].map((color) => (
          <div
            key={color}
            className={`color-circle color-${color} ${accent === color ? 'active' : ''}`}
            onClick={() => handleAccentChange(color)}
            title={`${color.charAt(0).toUpperCase() + color.slice(1)} Accent`}
          />
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-glass)', borderRadius: '8px', padding: '0.25rem' }}>
        <button 
          className={`btn-icon ${theme === 'light' ? 'active' : ''}`} 
          style={{ width: '32px', height: '32px', background: theme === 'light' ? 'var(--accent-color)' : 'transparent', color: theme === 'light' ? '#fff' : 'inherit' }}
          onClick={() => handleThemeChange('light')}
          title="Light Mode"
        >
          <Sun size={16} />
        </button>
        <button 
          className={`btn-icon ${theme === 'auto' ? 'active' : ''}`} 
          style={{ width: '32px', height: '32px', background: theme === 'auto' ? 'var(--accent-color)' : 'transparent', color: theme === 'auto' ? '#fff' : 'inherit' }}
          onClick={() => handleThemeChange('auto')}
          title="System Auto"
        >
          <Monitor size={16} />
        </button>
        <button 
          className={`btn-icon ${theme === 'dark' ? 'active' : ''}`} 
          style={{ width: '32px', height: '32px', background: theme === 'dark' ? 'var(--accent-color)' : 'transparent', color: theme === 'dark' ? '#fff' : 'inherit' }}
          onClick={() => handleThemeChange('dark')}
          title="Dark Mode"
        >
          <Moon size={16} />
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
