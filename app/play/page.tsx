'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Question {
  question_id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const GamePage = () => {
  const [game, setGame] = useState({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const todayDate = new Date().toISOString();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState(Array(5).fill(''));
  const [count, setCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
      axios.get(`http://localhost:3000/api/games/${todayDate}`).then(response => {
        setGame(response.data);
        setQuestions(response.data.questions);
        setCurrentQuestion(response.data.questions[0]);
      }).catch(error => console.log(error));
  }, []);

  const handleAnswerSubmit = () => {
    if (count < 2) {
      setCurrentQuestion(questions[count + 1]);
      setCount(count + 1);
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
        <h1 className="text-4xl font-bold mb-6">Question {count + 1}</h1>
        <p className="text-2xl mb-6">Category: {currentQuestion?.category}</p>
        <p className="text-2xl mb-6">{currentQuestion?.question}</p>
        <input
          type="text"
          value={answers[count]}
          onChange={(e) => handleChange(e, count)}
          className="border border-gray-300 rounded-md p-3 mb-6 text-xl"
          placeholder="Your answer..."
        />
        <button
          onClick={handleAnswerSubmit}
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-md text-xl"
        >
          {count < 2 ? 'Next Question' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
};

export default GamePage;
