import { motion } from "framer-motion";
import NewsLetter from "@/components/ContactUsCom/NewsLetter";
import ContactUsTabs from "@/components/ContactUsCom/ContactUsTabs";

export default function ContactUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Contact Support
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Our team is available 24/7 to help with any betting queries or
              account issues.
            </p>
          </div>
          <ContactUsTabs />
          <NewsLetter />
        </div>
      </div>
    </motion.div>
  );
}
