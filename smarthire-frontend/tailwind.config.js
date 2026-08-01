/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Student theme
        'st-primary': '#2563EB',
        'st-accent': '#0EA5E9',
        'st-bg': '#F8FAFF',
        'st-surface': '#FFFFFF',
        'st-text': '#1A2130',
        'st-muted': '#64748B',
        'st-border': '#E2E8F0',
        // Recruiter theme
        'rc-primary': '#4F46E5',
        'rc-accent': '#7C3AED',
        'rc-bg': '#FAFAF9',
        'rc-surface': '#FFFFFF',
        'rc-text': '#1C1917',
        'rc-muted': '#78716C',
        'rc-border': '#E7E5E4',
        // Admin dark theme
        'ad-bg': '#0D1117',
        'ad-surface': '#161B22',
        'ad-surface2': '#1C2333',
        'ad-primary': '#00D4AA',
        'ad-accent': '#3B82F6',
        'ad-text': '#E6EDF3',
        'ad-muted': '#7D8590',
        'ad-border': '#21262D',
        // Semantic (shared)
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        card: '8px',
        modal: '12px',
        btn: '6px',
        input: '4px',
        badge: '2px',
      },
      boxShadow: {
        card: 'none',
        float: '0 4px 12px rgba(0,0,0,0.08)',
        modal: '0 8px 32px rgba(0,0,0,0.12)',
        focus: '0 0 0 3px rgba(37,99,235,0.20)',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}
