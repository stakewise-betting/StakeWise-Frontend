module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	  "./node_modules/tw-elements-react/dist/js/**/*.js",
	],
	theme: {
	  extend: {
		colors: {
		  primary: "#1C1C27", // for dark background
		  secondary: "#E27625", // dark mode secondary color
		  sub:"#8488AC",
		  DFprimary: "#FFFFFF", // Light mode primary font color
		  DFsecondary: "#8488AC", // Light mode secondary font color
		  LFprimary: "#000000", // Dark mode primary font color
		  LFsecondary: "#5F5F5F", // Dark mode secondary font color
		  card: "#333447", // card background for dark mode
		  green: "#00BD58", // Green for success actions
		  red: "#BF3A19", // Red for danger actions
		  orange500: "#E27625", // Orange for button actions (default shade)
		  orange600: "#d46222" // Orange for button actions (hover shade)
		  
		},
		fontFamily: {
		  "saira-stencil": ["Saira Stencil One", "sans-serif"], // Saira Stencil font for site name
		},
	  },
	},
	plugins: [],
  };
