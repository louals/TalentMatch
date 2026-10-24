import { motion } from "framer-motion";

const features = [
  {
    title: "Smart CV Analysis",
    description:
      "Our AI scans your CV to understand your skills and experience deeply, so you get tailored job matches.",
    icon: (
      <svg
        className="w-12 h-12 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        <path d="M12 7v6l3 3" />
      </svg>
    ),
  },
  {
    title: "Instant Job Matching",
    description:
      "Skip endless scrolling — our algorithm instantly connects you with jobs that actually fit you.",
    icon: (
      <svg
        className="w-12 h-12 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Personalized Cover Letters",
    description:
      "Get AI-generated, tailored cover letters that make you stand out, saving time and boosting chances.",
    icon: (
      <svg
        className="w-12 h-12 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8" />
        <path d="M8 14h6" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section
      aria-label="Features of MatchifAI"
      className="max-w-7xl mx-auto py-20 px-6 sm:px-8 lg:px-12 text-center"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]"></div>
      </div>
      <div className="absolute -z-10 overflow-hidden inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/5 opacity-30 animate-float blur-xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/5 opacity-30 animate-float animation-delay-4000 blur-xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary tracking-wider">
          Powerful Features
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Why <span className="text-primary">MatchifAI</span> Rocks
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-12">
          Our platform leverages cutting-edge AI to transform your job search experience
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map(({ title, description, icon }, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center transition-all hover:shadow-lg border border-gray-200/80 dark:border-gray-800/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
          >
            <div className="mb-6 p-4 rounded-full bg-primary/5 shadow-sm">
              {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
            <motion.div
              className="mt-6 w-12 h-1 bg-primary rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 + 0.3, duration: 0.6 }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        {/* Additional content can go here */}
      </motion.div>
    </section>
  );
}