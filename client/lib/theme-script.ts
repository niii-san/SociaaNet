// Inline theme initialization script
// This runs before React hydrates to prevent flash of wrong theme (FOWT)
// It reads from localStorage and applies the theme class immediately

export const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('sociaa-theme') || 'system';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {}
})();
`;
