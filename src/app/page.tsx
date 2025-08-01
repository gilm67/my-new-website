"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="text-white">
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: "url('/background-map.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-4">Executive Partners</h1>
          <p className="text-xl mb-8">
            Premium Recruitment in Private Banking & Wealth Management
          </p>

          {/* 3 CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#candidates"
              className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Discover Candidates
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#jobs"
              className="px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700"
            >
              Latest Job Openings
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#newsletter"
              className="px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700"
            >
              Wealth Pulse Newsletter
            </motion.a>
          </div>
        </div>
      </section>

      {/* Featured Candidates Section */}
      <section
        id="candidates"
        className="py-16 px-4 bg-gray-900 text-center"
      >
        <h2 className="text-3xl font-bold mb-12">Featured Candidates</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["Senior RM – Geneva", "Private Banker – Dubai", "Team Head – Singapore"].map((title, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300 text-sm mb-4">
                Strong AUM, UHNW/HNW coverage, multi-market expertise.
              </p>
              <a
                href="#contact"
                className="text-blue-400 hover:underline"
              >
                Request Profile →
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Job Openings Section */}
      <section
        id="jobs"
        className="py-16 px-4 bg-gray-100 text-gray-900 text-center"
      >
        <h2 className="text-3xl font-bold mb-12">Latest Job Openings</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Private Banker – Zurich", desc: "Focus on Swiss Onshore HNW clients." },
            { title: "Senior RM – London", desc: "UHNW desk, multi-asset experience required." },
            { title: "Team Head – Dubai", desc: "MEA coverage with strong leadership experience." },
          ].map((job, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{job.desc}</p>
              <a
                href="#apply"
                className="text-blue-600 hover:underline"
              >
                Apply Now →
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        id="newsletter"
        className="py-16 px-4 bg-gray-900 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">The Private Wealth Pulse</h2>
        <p className="mb-8 text-gray-300">
          Weekly Intelligence for Private Bankers & Wealth Leaders
        </p>
        <a
          href="#subscribe"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
        >
          Subscribe Now
        </a>
      </section>
    </main>
  );
}
