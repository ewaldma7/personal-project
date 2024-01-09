'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button, TextFieldInput } from '@radix-ui/themes';

interface Question {
  question_id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

type id = number | null

const GamePage = () => {
  const NUM_QUESTIONS = 5;
  const [gameId, setGameId] = useState<id>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const todayDate = new Date().toLocaleDateString().replace(/\//g, '-');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState(Array(5).fill(''));
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/games/${todayDate}`).then(response => {
      setGameId(response.data.game_id);
      setQuestions(response.data.questions);
      setCurrentQuestion(response.data.questions[0]);
    }).catch(error => console.log(error));
  }, []);



  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      const answer = answers[index];
      return score + (answer && answer.toLowerCase() === question.answer.toLowerCase() ? 1 : 0);
    }, 0);
  }

  const handleAnswerNext = () => {
    setCurrentQuestion(questions[count + 1]);
    setCount(count + 1);
  }

  const handleAnswerSubmit = async () => {
    console.log(answers);
    const score = calculateScore();
    try {
      console.log(session?.user.user_id)
      const reqBody = {user_id: session?.user.user_id, game_id: gameId, answers: answers, score: score, date: todayDate};
      const response = await axios.post(`http://localhost:3000/api/results/`, reqBody);
      router.push(`/results/${todayDate}`);
    } catch (error) {
      console.error(error);
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
      <TextFieldInput size='3'
        type="text"
        value={answers[count]}
        onChange={(e) => handleChange(e, count)}
        placeholder="Your answer..."
      />
      <br/>
      <Button size='4' className='mt-10'
        onClick={count < NUM_QUESTIONS - 1 ? handleAnswerNext : handleAnswerSubmit}
      >
        {count < NUM_QUESTIONS - 1 ? 'Next Question' : 'Submit Answers'}
      </Button>
    </div>
  </div>
);
};

export default GamePage;
