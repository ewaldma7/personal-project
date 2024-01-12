'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';

interface Question {
  question_id: number;
  question: string;
  correctChoice: string;
  choices: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

type id = number | null

const GamePage = () => {
  const NUM_QUESTIONS = 5;
  const [gameId, setGameId] = useState<id>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const todayDate = new Date().toLocaleDateString().replace(/\//g, '-');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [guesses, setGuesses] = useState(Array(5).fill(''));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const game = await axios.get(`http://localhost:3000/api/games/${todayDate}`);
      setGameId(game.data.game_id);
      setQuestions(game.data.questions);
      setCurrentQuestion(game.data.questions[0]);
      setLoading(false);
    }
    fetchData();
  }, []);

  function getGuess() {
    return currentQuestion?.choices[selectedOption as number - 1];
  } 

  function isCorrect() {
    return  getGuess() === currentQuestion?.correctChoice
  }

  const updateData = () => {
    guesses[count] = {question_id: currentQuestion?.question_id, category: currentQuestion?.category, guess: getGuess(), isCorrect: isCorrect(), user_id: session?.user.user_id }
    setGuesses(guesses);
    console.log(guesses);
  }



  const calculateScore = () => {
    return guesses.reduce((score, guess) => {
      return guess.isCorrect ? score + 1 : score;
    }, 0);
  }

  const handleAnswerNext = () => {
    updateData();
    setSelectedOption(null);
    setCurrentQuestion(questions[count + 1]);
    setCount(count + 1);
  }

  const handleAnswerSubmit = async () => {
    updateData();
    const score = calculateScore();
    try {
      console.log(guesses)
      const reqBody = { user_id: session?.user.user_id, game_id: gameId, score: score, date: todayDate };
      const response = await axios.post(`http://localhost:3000/api/results/`, reqBody);
      const resultId = response.data.result_id;
      guesses.forEach(guess => {
        guess['result_id'] = resultId;
      });
      const guessResponse = await axios.post(`http://localhost:3000/api/guesses/`, guesses);
      router.push(`/results/${todayDate}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    !loading &&
    <div className="flex justify-center items-center mt-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Question {count + 1}</h1>
        <p className="text-2xl mb-6">Category: {currentQuestion?.category}</p>
        <p className="text-2xl mb-6">{currentQuestion?.question}</p>

        {/* Render answer choices as styled buttons */}
        <div className="flex flex-col gap-4 mb-6">
          {currentQuestion?.choices.map((choice, index) => (
            <button
              key={index}
              className={`text-xl py-2 px-4 border rounded transition ${
                selectedOption === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedOption(selectedOption === index + 1 ? null : index + 1)}
            >
              {choice}
            </button>
          ))}
        </div>

        <br />
        <Button size="4" className="mt-10" onClick={count < NUM_QUESTIONS - 1 ? handleAnswerNext : handleAnswerSubmit}>
          {count < NUM_QUESTIONS - 1 ? 'Next Question' : 'Submit Answers'}
        </Button>
      </div>
    </div>
  );
};

export default GamePage;
