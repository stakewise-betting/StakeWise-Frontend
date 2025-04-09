## Technology Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT

# React + TypeScript + Vite

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
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

StakeWise-Frontend
├── public/ # Static assets served directly by the web server
├── src/ # Main source code directory
│ ├── Admin/ # Components and pages specific to the Admin Panel
│ │ ├── dashboard/ # Admin dashboard specific components/pages
│ │ │ └── Dashboard.tsx # Main component for the admin dashboard view
│ │ ├── events/ # Components related to managing events (likely betting events)
│ │ │ ├── AddEventModal.tsx # Modal window for adding a new event
│ │ │ ├── EventForm.tsx # Form component for creating/editing events
│ │ │ ├── EventListTable.tsx # Table component to display a list of events
│ │ │ ├── EventsPage.tsx # Main page component for the admin events section
│ │ │ └── EventTableItem.tsx # Component representing a single row in the event table
│ │ ├── layout/ # Layout components specific to the Admin section
│ │ │ ├── AdminLayout.tsx # Main layout wrapper for admin pages
│ │ │ └── Sidebar.tsx # Sidebar navigation component for the admin panel
│ │ ├── reports/ # Components related to generating/viewing reports
│ │ │ └── DownloadReport.tsx # Component/logic for downloading reports
│ │ └── shared/ # Components shared within the Admin section
│ │ ├── DeclareWinnerSection.tsx # UI section for declaring event winners
│ │ ├── ImageUploader.tsx # Component for uploading images (e.g., event images)
│ │ └── AdminPanel.tsx # A general panel or container component for the admin UI
│ ├── assets/ # Static assets like images, icons, fonts bundled with the app
│ ├── components/ # Reusable UI components shared across the application
│ │ ├── Achievements/ # Components related to displaying user achievements
│ │ │ ├── Achievements.tsx # Main component for showing achievements
│ │ │ └── circular-progress.tsx # Reusable circular progress bar component
│ │ ├── BetInterface/ # Components for the main betting interface
│ │ │ └── BetInterface.tsx # Core component for placing/managing bets
│ │ ├── BetSlip/ # Components related to the user's bet slip
│ │ │ └── BetSlip.tsx # The main bet slip component
│ │ ├── BettingCard/ # Card component specifically for displaying bets/events
│ │ │ └── BettingCard.tsx # The betting card UI component
│ │ ├── Buttons/ # Reusable button components
│ │ │ └── Buttons.tsx # Likely exports various styled button components
│ │ ├── Card/ # Generic reusable card component
│ │ │ └── Card.tsx # Basic card container component
│ │ ├── ContactUsCom/ # Components specifically for the Contact Us section/page
│ │ │ └── ContactUsTabs.tsx # Tab navigation within the Contact Us section
│ │ ├── NewsLetter/ # Component for newsletter subscription
│ │ │ └── NewsLetter.tsx # Newsletter signup form/component
│ │ ├── dropdownMenu/ # Reusable dropdown menu component
│ │ │ └── DropdownMenu.tsx # The dropdown menu UI component
│ │ ├── Footer/ # Site-wide footer component
│ │ │ └── Footer.tsx # The main application footer
│ │ ├── GoogleAuth/ # Component for Google Sign-In/Authentication
│ │ │ └── GoogleLogin.tsx # Google login button and logic
│ │ ├── interestedBtn/ # A specific button, likely for users to mark interest
│ │ │ └── IntererstedBtn.tsx # "Interested" button component (Note: Typo in original filename)
│ │ ├── Metamask/ # Component for MetaMask wallet integration
│ │ │ └── MetaMaskLogin.tsx # MetaMask connection button and logic
│ │ ├── Moonpay/ # Components related to Moonpay integration (crypto purchase)
│ │ │ └── MoonPayWidget.tsx # Component to embed/interact with Moonpay
│ │ ├── Navbar/ # Site-wide navigation bar component
│ │ │ └── Navbar.tsx # The main application navigation bar
│ │ ├── Pagination/ # Reusable component for pagination controls
│ │ │ └── Pagination.tsx # Pagination UI and logic
│ │ ├── popup/ # Components for displaying popups or modals
│ │ │ └── SuccessPopup.tsx # A specific popup for success messages
│ │ ├── ProfileCom/ # Components used within the User Profile section
│ │ │ ├── AccountPreferences.tsx # Component for managing account preferences
│ │ │ ├── ContactInfoForm.tsx # Form for editing user contact information
│ │ │ ├── DangerZone.tsx # Section for critical actions (e.g., account deletion)
│ │ │ ├── FormField.tsx # Reusable form field component (likely used in profile forms)
│ │ │ ├── PasswordSecurity.tsx # Component for password and security settings
│ │ │ ├── PersonalInfoForm.tsx # Form for editing user personal information
│ │ │ ├── PreferenceItem.tsx # Component for a single preference setting item
│ │ │ ├── PrivacySettings.tsx # Component for managing user privacy settings
│ │ │ ├── ProfilePicture.tsx # Component for displaying/updating profile picture
│ │ │ └── SettingsCard.tsx # Card container used within profile settings pages
│ │ ├── SearchBar/ # Reusable search bar component
│ │ │ └── SearchBar.tsx # The search input component
│ │ ├── Slider/ # Reusable slider or carousel component
│ │ │ └── Slider.tsx # The slider UI component
│ │ ├── Tables/ # Reusable table components or specific table views
│ │ │ ├── BetHistory.tsx # Table displaying user's past bets
│ │ │ ├── OngoingTable.tsx # Table displaying user's ongoing bets/events
│ │ │ └── TransactionTable.tsx # Table displaying user's financial transactions
│ │ ├── ui/ # Generic, low-level UI building blocks (e.g., custom input, modal base) - content not fully shown
│ │ ├── UpcomingCard/ # Card component for displaying upcoming events/bets
│ │ │ └── UpcomingCard.tsx # The upcoming event card component
│ │ ├── CommentSection.tsx # Component for displaying and adding comments
│ │ ├── CountdownTimer.tsx # Component to display a countdown timer
│ │ └── sample.jpg # A sample image file, likely for testing or placeholders
│ ├── config/ # Configuration files for the application
│ │ └── contractConfig.ts# Configuration related to blockchain smart contracts
│ ├── constants/ # Storing constant values (e.g., API endpoints, keys) - content not fully shown
│ ├── context/ # React Context API providers and consumers for global state
│ │ └── AppContext.tsx # Main application context for global state management
│ ├── data/ # Static data, mock data, or data fetching utilities - content not fully shown
│ ├── hooks/ # Custom React hooks for reusable logic - content not fully shown
│ ├── layout/ # Main application layout components
│ │ └── layout.tsx # Primary layout structure (e.g., includes Navbar, Footer)
│ ├── lib/ # Utility functions or libraries - content not fully shown
│ ├── pages/ # Components representing application pages/routes
│ │ ├── BetDetails/ # Page displaying details of a specific bet/event
│ │ │ └── BetDetails.tsx # Main component for the Bet Details page
│ │ ├── ContactUs/ # The Contact Us page
│ │ │ └── ContactUs.tsx # Main component for the Contact Us page
│ │ ├── Dashboard/ # The main user dashboard page
│ │ │ └── Dashboard.tsx # Main component for the user dashboard
│ │ ├── DepositPage/ # Page for users to deposit funds
│ │ │ └── DepositPage.tsx # Main component for the deposit page
│ │ ├── HomePage/ # The application's home/landing page
│ │ │ ├── home.tsx # Potentially an older or alternative home page component
│ │ │ └── HomePage.tsx # Main component for the home page
│ │ ├── Politics/ # Page displaying political betting events
│ │ │ └── Politics.tsx # Main component for the Politics category page
│ │ ├── Profile/ # The user's profile page
│ │ │ └── Profile.tsx # Main component for the user profile page
│ │ ├── Results/ # Page displaying results of past events
│ │ │ ├── Results.css # Styles specific to the Results page
│ │ │ └── Results.tsx # Main component for the Results page
│ │ ├── Sports/ # Page displaying sports betting events
│ │ │ └── Sports.tsx # Main component for the Sports category page
│ │ ├── Upcoming/ # Page displaying upcoming events
│ │ │ └── Upcoming.tsx # Main component for the Upcoming events page
│ │ └── userAuth/ # Components/Pages related to user authentication flows
│ │ ├── EmailVerify.tsx # Page/component for email verification process
│ │ ├── Login.tsx # The user login page/component
│ │ └── ResetPassword.tsx# Page/component for resetting user password
│ ├── schema/ # Data validation schemas (e.g., for forms using Zod/Yup) - content not fully shown
│ ├── section/ # Larger, possibly reusable sections of pages - content not fully shown
│ ├── services/ # Modules for interacting with APIs or external services
│ │ └── blockchainService.ts # Service for interacting with the blockchain/smart contracts
│ ├── types/ # TypeScript type definitions and interfaces - content not fully shown
│ ├── utils/ # General utility functions - content not fully shown
│ ├── App.css # Global application styles or component-specific styles for App.tsx
│ ├── App.tsx # Root component of the React application, sets up routing
│ ├── index.css # Base styles, resets, global CSS variables
│ ├── main.tsx # Main entry point of the application (renders App.tsx to the DOM)
│ └── vite-env.d.ts # TypeScript definitions for Vite environment variables
├── .env # Environment variables (should be in .gitignore)
├── .gitattributes # Git attribute settings
├── .gitignore # Specifies intentionally untracked files that Git should ignore
├── components.json # Configuration likely for a UI library or CLI tool (e.g., shadcn/ui)
├── eslint.config.js # Configuration for ESLint (code linting)
├── index.html # Main HTML entry point for the Vite application
├── package.json # Project metadata, dependencies, and scripts
├── postcss.config.js # Configuration for PostCSS (CSS transformations)
├── README.md # Project documentation
├── tailwind.config.js # Configuration for Tailwind CSS framework
├── tsconfig.app.json # TypeScript configuration specific to the application build
├── tsconfig.json # Base TypeScript configuration for the project
├── tsconfig.node.json # TypeScript configuration for Node.js specific parts (e.g., config files)
├── vite.config.ts # Configuration file for the Vite build tool
└── yarn.lock # Exact dependency versions (if using Yarn) or package-lock.json (if using npm)
