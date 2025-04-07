'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="w-4 h-4 rounded-full bg-blue-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          delay: 0,
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-indigo-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-purple-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          delay: 0.4,
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-pink-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          delay: 0.6,
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-blue-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          delay: 0.8,
        }}
      />
    </div>
  );
}