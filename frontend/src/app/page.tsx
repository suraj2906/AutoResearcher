'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from './components/LoadingAnimation';

export default function ResearchPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      // Using our local API route instead of directly calling the external API
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialResult = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value, { stream: true });
          partialResult += text;
          setResult(partialResult);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
  
  useEffect(() => {
    if (resultRef.current && result) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AutoResearcher
          </h1>
          <p className="text-xl text-blue-200">
            Generate comprehensive research papers with AI
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mb-16"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your research topic..."
              className="flex-grow px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 shadow-lg"
            >
              {isLoading ? 'Researching...' : 'Research'}
            </motion.button>
          </div>
        </motion.form>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <LoadingAnimation />
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg mb-8"
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 markdown-body"
            ref={resultRef}
          >
            <div className="prose prose-invert prose-blue max-w-none">
              {result.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return (
                    <motion.h2 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold mt-8 mb-4 text-blue-400"
                    >
                      {line.replace('## ', '')}
                    </motion.h2>
                  );
                }
                return (
                  <motion.p
                  key={`p-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }} // Staggered delay
                  className="mb-4"
                >
                  {line}
                </motion.p>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}