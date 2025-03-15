import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const Layout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Outlet />
    </motion.div>
  );
};

export default Layout;
