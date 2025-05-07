<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
``` -->


## PROJECT OVERVIEW

- Project name: StakeWise Blockchain Based Betting Platform
- Project type: Web App

## Frontend Package.json

{
"name": "react-vite-template",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
"dev": "vite --host",
"build": "tsc -b && vite build",
"lint": "eslint .",
"preview": "vite preview"
},
"dependencies": {
"@fortawesome/fontawesome-free": "^6.7.2",
"@hookform/resolvers": "^3.9.1",
"@metamask/providers": "^20.0.0",
"@moonpay/moonpay-react": "^1.8.10",
"@radix-ui/react-avatar": "^1.1.3",
"@radix-ui/react-collapsible": "^1.1.3",
"@radix-ui/react-dialog": "^1.1.6",
"@radix-ui/react-dropdown-menu": "^2.1.6",
"@radix-ui/react-label": "^2.1.1",
"@radix-ui/react-popover": "^1.1.6",
"@radix-ui/react-progress": "^1.1.2",
"@radix-ui/react-radio-group": "^1.2.2",
"@radix-ui/react-scroll-area": "^1.2.3",
"@radix-ui/react-select": "^2.1.6",
"@radix-ui/react-separator": "^1.1.2",
"@radix-ui/react-slot": "^1.1.1",
"@radix-ui/react-switch": "^1.1.3",
"@radix-ui/react-tabs": "^1.1.3",
"@radix-ui/react-tooltip": "^1.1.8",
"@react-oauth/google": "^0.12.1",
"@types/js-cookie": "^3.0.6",
"axios": "^1.7.9",
"class-variance-authority": "^0.7.0",
"cloudinary-react": "^1.8.1",
"clsx": "^2.1.1",
"date-fns": "^4.1.0",
"ethers": "^6.13.5",
"framer-motion": "^12.5.0",
"js-cookie": "^3.0.5",
"jwt-decode": "^4.0.0",
"lucide-react": "^0.427.0",
"react": "^18.3.1",
"react-datepicker": "^8.0.0",
"react-day-picker": "^9.5.1",
"react-dom": "^18.3.1",
"react-hook-form": "^7.54.2",
"react-icons": "^5.4.0",
"recharts": "^2.15.1",
"react-toastify": "^11.0.5",
"sonner": "^1.5.0",
"swiper": "^11.1.15",
"tailwind-merge": "^3.0.1",
"tailwindcss-animate": "^1.0.7",
"toastify-react": "^4.3.1",
"tw-elements-react": "^1.0.0-alpha-end",
"web3": "^4.16.0",
"zod": "^3.24.1"
},
"devDependencies": {
"@eslint/js": "^9.8.0",
"@types/jwt-decode": "^3.1.0",
"@types/node": "^22.2.0",
"@types/react": "^18.3.3",
"@types/react-dom": "^18.3.0",
"@types/recharts": "^1.8.29",
"@vitejs/plugin-react-swc": "^3.5.0",
"autoprefixer": "^10.4.20",
"eslint": "^9.8.0",
"eslint-plugin-react-hooks": "^5.1.0-rc.0",
"eslint-plugin-react-refresh": "^0.4.9",
"globals": "^15.9.0",
"postcss": "^8.4.41",
"tailwindcss": "^3.4.9",
"typescript": "^5.5.3",
"typescript-eslint": "^8.0.0",
"vite": "^5.4.0"
}
}

## Backend Package.json

{
"name": "backend",
"version": "1.0.0",
"main": "index.js",
"type": "module",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"start": "node server.js",
"server": "nodemon server.js"
},
"keywords": [],
"author": "",
"license": "ISC",
"description": "",
"dependencies": {
"bcryptjs": "^3.0.2",
"body-parser": "^1.20.3",
"cloudinary": "^2.6.0",
"cookie-parser": "^1.4.7",
"cors": "^2.8.5",
"crypto": "^1.0.1",
"dotenv": "^16.4.7",
"ethers": "^6.13.5",
"express": "^4.21.2",
"google-auth-library": "^9.15.1",
"jsonwebtoken": "^9.0.2",
"mongoose": "^8.10.1",
"multer": "^1.4.5-lts.1",
"openai": "^4.86.1",
"nodemailer": "^6.10.0",
"nodemon": "^3.1.9",
"passport": "^0.7.0",
"passport-google-oauth20": "^2.0.0",
"pdfkit": "^0.16.0",
"socket.io": "^4.8.1",
"web3": "^1.10.0"
}
}

## Blockchain Package.json

{
"dependencies": {
"@truffle/hdwallet-provider": "^2.1.15",
"web3": "^4.16.0"
},
"scripts": {
"build": "truffle compile"
}

}

## TECHNICAL STACK

- Frontend: React(typescript),tailwind
- Backend:Node.js,Express
- Database: MongoDB
- Authentication:JWT,Google OAuth

## PROJECT STRUCTURE

Backend:
Backend/NewBackend/
├── config/
│ ├── cloudinaryConfig.js
│ ├── config.js
│ ├── emailTemplate.js
│ └── nodemailer.js
├── controllers/
│ ├── adminController.js
│ ├── authController.js
│ ├── eventController.js
│ ├── notificationController.js
│ ├── userController.js
│ └── userUpdateController.js
├── middleware/
│ ├── adminAuth.js
│ ├── multerConfig.js
│ └── userAuth.js
├── models/
│ ├── comment.js
│ ├── event.js
│ ├── notification.js
│ └── userModel.js
├── node_modules/
├── routes/
│ ├── adminRoutes.js
│ ├── authRoutes.js
│ ├── commentRoutes.js
│ ├── eventRoutes.js
│ ├── notificationRoutes.js
│ ├── reportRoutes.js
│ ├── userRoutes.js
│ └── userUpdateRoutes.js
├── services/
│ ├── blockchainService.js
│ └── websocketService.js
├── .env
├── .gitignore
├── app.js
├── betting_report.pdf
├── package-lock.json
├── package.json
├── README.md
└── server.js

Frontend:
StakeWise-Frontend/
├── dist/
├── node_modules/
├── public/
├── src/
│ ├── Admin/
│ │ ├── dashboard/
│ │ │ └── Dashboard.tsx
│ │ ├── events/
│ │ │ ├── AddEventModal.tsx
│ │ │ ├── EventForm.tsx
│ │ │ ├── EventListTable.tsx
│ │ │ ├── EventsPage.tsx
│ │ │ └── EventTableItem.tsx
│ │ ├── layout/
│ │ │ ├── AdminLayout.tsx
│ │ │ └── Sidebar.tsx
│ │ ├── reports/
│ │ │ └── DownloadReport.tsx
│ │ └── shared/
│ │ └── AdminPanel.tsx
│ ├── assets/
│ ├── components/
│ │ ├── Achievements/
│ │ │ └── Achievements.tsx
│ │ ├── AutomaticSlider/
│ │ │ └── AutomaticSlider.tsx
│ │ ├── BetInterface/
│ │ │ └── BetInterface.tsx
│ │ ├── BetSlip/
│ │ │ └── BetSlip.tsx
│ │ ├── BettingCard/
│ │ │ └── BettingCard.tsx
│ │ ├── Buttons/
│ │ │ └── Buttons.tsx
│ │ ├── ContactUsCom/
│ │ │ └── ContactUsTabs.tsx
│ │ ├── Footer/
│ │ │ └── Footer.tsx
│ │ ├── GoogleAuth/
│ │ │ └── GoogleLogin.tsx
│ │ ├── InterestedBtn/
│ │ │ └── IntererstedBtn.tsx
│ │ ├── Metamask/
│ │ │ └── MetamaskLogin.tsx
│ │ ├── Moonpay/
│ │ │ └── MoonPayWidget.tsx
│ │ ├── Navbar/
│ │ │ ├── MobileMenu.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── navbar.types.ts
│ │ │ ├── navbar.utils.ts
│ │ │ ├── NotificationsBell.tsx
│ │ │ ├── UserProfileDropdown.tsx
│ │ │ └── WalletConnect.tsx
│ │ ├── NewFooter/
│ │ │ ├── Footer.tsx
│ │ │ ├── FooterBottom.tsx
│ │ │ ├── FooterHeader.tsx
│ │ │ ├── LegalSection.tsx
│ │ │ ├── PartnersSection.tsx
│ │ │ ├── Sociallcons.tsx
│ │ │ ├── StakewiseLogo.tsx
│ │ │ └── TeamLogo.tsx
│ │ ├── NewSerachBar/
│ │ │ ├── CategoryTag.tsx
│ │ │ ├── FilterBar.tsx
│ │ │ └── SearchBar.tsx
│ │ ├── Pagination/
│ │ │ └── Pagination.tsx
│ │ ├── popup/
│ │ │ └── SuccessPopup.tsx
│ │ ├── Privacy/
│ │ │ └── PrivacyHeader.tsx
│ │ ├── ProfileCom/
│ │ │ ├── AccountPreferences.tsx
│ │ │ ├── ContactInfoForm.tsx
│ │ │ ├── DangerZone.tsx
│ │ │ ├── FormField.tsx
│ │ │ ├── PasswordSecurity.tsx
│ │ │ ├── PersonalInfoForm.tsx
│ │ │ ├── PreferenceItem.tsx
│ │ │ ├── PrivacySettings.tsx
│ │ │ ├── ProfilePicture.tsx
│ │ │ └── SettingsCard.tsx
│ │ ├── RewardCom/
│ │ │ ├── RaffleSection.tsx
│ │ │ ├── RedeemSection.tsx
│ │ │ └── TokenClaimsSection.tsx
│ │ ├── SearchBar/
│ │ │ └── SearchBar.tsx
│ │ ├── Slider/
│ │ │ └── Slider.tsx
│ │ ├── Tables/
│ │ │ ├── BetHistory.tsx
│ │ │ ├── OngoingTable.tsx
│ │ │ └── TransactionTable.tsx
│ │ ├── Terms/
│ │ │ └── TermsHeader.tsx
│ │ ├── ui/
│ │ │ ├── alert.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── button.tsx
│ │ │ ├── calendar.tsx
│ │ │ ├── card.tsx
│ │ │ ├── collapsible.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── progress.tsx
│ │ │ ├── radio-group.tsx
│ │ │ ├── scroll-area.tsx
│ │ │ ├── select.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── sheet.tsx
│ │ │ ├── sidebar.tsx
│ │ │ ├── skeleton.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── table.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── textarea.tsx
│ │ │ └── tooltip.tsx
│ │ ├── UpcomingCard/
│ │ │ ├── UpcomingCard.tsx
│ │ │ ├── CommentSection.tsx
│ │ │ ├── CountdownTimer.tsx
│ │ │ └── sample.jpg
│ │ ├── circular-progress.tsx
│ │ ├── NewsLetter.tsx
│ ├── config/
│ │ └── contractConfig.ts
│ ├── constants/
│ │ └── route.constant.ts
│ ├── context/
│ │ └── AppContext.tsx
│ ├── data/
│ │ ├── betHistory.json
│ │ ├── data.tsx
│ │ ├── onGoingBets.json
│ │ ├── transactionHistory.json
│ │ └── upcomingEvent.json
│ ├── hooks/
│ │ └── use-mobile.tsx
│ ├── layout/
│ │ └── layout.tsx
│ ├── lib/
│ │ └── utils.ts
│ ├── pages/
│ │ ├── BetDetails/
│ │ │ └── BetDetails.tsx
│ │ ├── ContactUs/
│ │ │ └── ContactUs.tsx
│ │ ├── Dashboard/
│ │ │ └── Dashboard.tsx
│ │ ├── DepositPage/
│ │ │ └── Deposit.tsx
│ │ ├── HomePage/
│ │ │ └── home.tsx
│ │ ├── Politics/
│ │ │ └── Politics.tsx
│ │ ├── PrivacyPolicy/
│ │ ├── Profile/
│ │ │ └── Profile.tsx
│ │ ├── Results/
│ │ │ ├── Results.css
│ │ │ └── Results.tsx
│ │ ├── Reward/
│ │ │ └── Reward.tsx
│ │ ├── Sports/
│ │ │ └── Sports.tsx
│ │ ├── TermsOfUse/
│ │ ├── Upcoming/
│ │ │ └── Upcoming.tsx
│ │ └── userAuth/
│ │ ├── EmailVerify.tsx
│ │ ├── Login.tsx
│ │ └── ResetPassword.tsx
│ ├── schema/
│ │ ├── contactSchema.ts
│ │ └── userSchema.ts
│ ├── section/
│ │ └── mainSection/
│ │ └── header.tsx
│ ├── services/
│ │ └── blockchainService.ts
│ ├── types/
│ ├── utils/
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── vite-env.d.ts
├── .env
├── .gitattributes
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.app.tsbuildinfo
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.node.tsbuildinfo
├── vite.config.ts
└── yarn.lock

Blockchain:
StakeWise-Blockchain/
├── build/
├── contracts/
│ ├── .gitkeep
│ └── BettingEvents.sol
├── migrations/
│ ├── .gitkeep
│ └── 2_deploy_betting.js
├── node_modules/
├── test/
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── truffle-config.js

## STYLE PREFERENCES

// tailwind.config.js
module.exports = {
content: [
"./src//*.{js,jsx,ts,tsx}",
"./node_modules/tw-elements-react/dist/js//*.js",
"./components//*.{js,ts,jsx,tsx}",
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
        green: "#00BD58", // Green for success actions
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
}}