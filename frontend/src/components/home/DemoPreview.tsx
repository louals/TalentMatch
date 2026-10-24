import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import place from "../../assets/place.svg"

export default function DemoPreview() {
  return (
    <section
      className="max-w-6xl mx-auto py-20 px-6 sm:px-12 text-center"
      aria-label="MatchifAI in action"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-black dark:text-white">
        See MatchifAI in Action
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
        Experience how easy job hunting becomes with smart matching and instant cover letters. No fluff — just results.
      </p>

      <motion.div
        className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={place}
          alt="Demo of MatchifAI"
          className="w-full object-cover"
        />
      </motion.div>

      <div className="mt-12">
        <Link
          to="/upload"
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition duration-300"
        >
          Try It Yourself – Upload Your CV
        </Link>
      </div>
    </section>
  );
}
