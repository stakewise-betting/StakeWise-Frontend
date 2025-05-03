// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
	  "./node_modules/tw-elements-react/dist/js/**/*.js",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' if you prefer system settings
  theme: {
    extend: {
      colors: {
        // Main theme colors
        primary: "#1C1C27", // for dark background
        secondary: "#E27625", // dark mode secondary color
        sub: "#8488AC", // subdued color
        
        // Font colors for different modes
        light: {
          primary: "#000000", // Light mode primary font color
          secondary: "#5F5F5F", // Light mode secondary font color
        },
        dark: {
          primary: "#FFFFFF", // Dark mode primary font color
          secondary: "#8488AC", // Dark mode secondary font color
        },
        
        // UI element colors
        card: "#333447", // card background for dark mode
        orange: {
          500: "#E27625", // Orange for button actions (default shade)
          600: "#d46222", // Orange for button actions (hover shade)
        },
        
        // Additional semantic colors from the CSS file
        admin: {
          primary: {
            DEFAULT: "#6d28d9", // purple-700
            hover: "#5b21b6", // purple-800
            light: "#ddd6fe", // purple-200
          },
          secondary: {
            DEFAULT: "#4f46e5", // indigo-600
            hover: "#4338ca", // indigo-700
          },
          accent: {
            DEFAULT: "#0d9488", // teal-600
            hover: "#0f766e", // teal-700
          },
          info: {
            DEFAULT: "#0891b2", // cyan-600
            hover: "#0e7490", // cyan-700
          },
          success: {
            DEFAULT: "#10b981", // emerald-500
            light: "#d1fae5", // emerald-100
          },
          warning: {
            DEFAULT: "#f59e0b", // amber-500
            light: "#fef3c7", // amber-100
          },
          danger: {
            DEFAULT: "#ef4444", // red-500
            light: "#fee2e2", // red-100
          },
        },
      },
      
      fontFamily: {
        "saira-stencil": ["Saira Stencil One", "sans-serif"], // Saira Stencil font for site name
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      
      boxShadow: {
        'game': '0 10px 15px -3px rgba(107, 70, 193, 0.2), 0 4px 6px -4px rgba(107, 70, 193, 0.2)',
        'game-dark': '0 10px 15px -3px rgba(139, 92, 246, 0.15), 0 4px 6px -4px rgba(139, 92, 246, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(107, 70, 193, 0.1), 0 10px 10px -5px rgba(107, 70, 193, 0.1)',
        'card-hover-dark': '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
        'btn-glow': '0 0 15px rgba(139, 92, 246, 0.5)',
      },
      
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'width-grow': 'widthGrow 1s ease-out',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'appear': 'appear 0.6s ease-out forwards',
        'admin-fade-in': 'adminFadeIn 0.3s ease-out forwards',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        widthGrow: {
          'from': { width: '0' },
          'to': { width: 'auto' },
        },
        'rotate-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        appear: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        adminFadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shiftBg: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(50px, 50px) scale(1.1)' },
        },
        waveEffect: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.05) rotate(1deg)' },
        }
      },
      
      
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'bg': 'background-color, background-image, background-position',
      },
      
      scale: {
        '102': '1.02',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark', 'dark:hover', 'hover', 'focus'],
      textColor: ['dark', 'dark:hover', 'hover', 'focus'],
      borderColor: ['dark', 'dark:hover', 'hover', 'focus'],
      opacity: ['dark', 'group-hover'],
      scale: ['hover', 'group-hover'],
      translate: ['hover', 'group-hover'],
      boxShadow: ['dark', 'hover', 'focus'],
      backgroundOpacity: ['dark'],
      gradientColorStops: ['dark'],
    },
  },
  plugins: [
    // You can add plugins like forms, typography, aspect-ratio, etc.
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    
    // Example custom plugin for the animated underline effect
    function ({ addComponents }) {
      addComponents({
        '.animated-link': {
          'position': 'relative',
          'display': 'inline-block',
          '&::after': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '2px',
            bottom: '0',
            left: '0',
            backgroundColor: 'theme("colors.purple.500")',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s ease-out',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
            transformOrigin: 'bottom left',
          },
        },
        '.gradient-text': {
          '@apply text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400': {},
        },
        '.bg-noise': {
          'position': 'relative',
          '&::after': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            opacity: '0.02',
            pointerEvents: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          },
        },
        '.dark .bg-noise::after': {
          opacity: '0.03',
        },
        '.bg-floating-shapes': {
          'position': 'relative',
          'overflow': 'hidden',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            right: '-100px',
            bottom: '-100px',
            backgroundImage: 'theme("backgroundImage.floating-shapes-light")',
            zIndex: '-1',
            animation: 'shiftBg 20s ease-in-out infinite alternate',
          },
        },
        '.dark .bg-floating-shapes::before': {
          backgroundImage: 'theme("backgroundImage.floating-shapes-dark")',
        },
        '.bg-wave': {
          'position': 'relative',
          'overflow': 'hidden',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundImage: 'theme("backgroundImage.wave-light")',
            zIndex: '-1',
            animation: 'waveEffect 10s ease-in-out infinite alternate',
          },
        },
        '.dark .bg-wave::before': {
          backgroundImage: 'theme("backgroundImage.wave-dark")',
        },
        '.btn-glow:hover': {
          boxShadow: 'theme("boxShadow.btn-glow")',
        },
        '.feature-card:hover': {
          boxShadow: 'theme("boxShadow.card-hover")',
        },
        '.dark .feature-card:hover': {
          boxShadow: 'theme("boxShadow.card-hover-dark")',
        },
      });
    },
    
    // Custom plugin to add various admin styles
    function({ addComponents }) {
      const adminComponents = {
        '.admin-card': {
          '@apply bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 ease-in-out overflow-hidden': {},
        },
        '.admin-card-hover': {
          '@apply hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-900 transform hover:-translate-y-1 transition-all duration-300': {},
        },
        '.admin-section-header': {
          '@apply flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700': {},
        },
        '.admin-section-title': {
          '@apply text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center': {},
        },
        // Additional admin components...
        // Add more admin components as needed
      };
      
      addComponents(adminComponents);
    }
  ],
}
