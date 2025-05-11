// import { defineConfig } from "vite"; 
// import react from "@vitejs/plugin-react-swc"; 
// import path from "path"; 
 
// // https://vitejs.dev/config/ 
// export default defineConfig({ 
//   plugins: [react()], 
//   resolve: { 
//     alias: { 
//       "@": path.resolve(__dirname, "src"), 
//     }, 
//   }, 
// });




// Bhashitha changed this code for Home page Filterbar function. 
// StakeWise-Frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // Import path

export default defineConfig({
  plugins: [react()],
  resolve: { // Ensure you have resolve alias if you use @/
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // port: 3000, // Or whatever your frontend dev port is
    proxy: {
      // Proxy API requests to your backend
      // Make sure the target port matches your backend server's port
      '/api': {
        target: 'http://localhost:5000', // e.g., http://localhost:5000 or http://localhost:8000
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // If your backend is not using HTTPS in dev
        // rewrite: (path) => path.replace(/^\/api/, ''), // Only if your backend doesn't expect /api prefix
      },
    },
  },
});