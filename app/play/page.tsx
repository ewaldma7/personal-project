'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const GamePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const router = useRouter();

  const categories = [
    'History',
    'Science',
    'Geography',
    // ... more categories
  ];

  const handleAnswerSubmit = () => {
    if (currentQuestion < 10) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, redirect to results page
      router.push('/results');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Question {currentQuestion}</h1>
        <p className="text-2xl mb-6">Category: {categories[currentQuestion - 1]}</p>
        <input
          type="text"
          value={answers[currentQuestion - 1]}
          onChange={(e) => handleChange(e, currentQuestion - 1)}
          className="border border-gray-300 rounded-md p-3 mb-6 text-xl"
          placeholder="Your answer..."
        />
        <button
          onClick={handleAnswerSubmit}
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-md text-xl"
        >
          {currentQuestion < 10 ? 'Next Question' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
};

export default GamePage;
