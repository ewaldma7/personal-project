"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CATEGORY_COLOR_MAP } from "@/constants";

interface Question {
  question_id: number;
  question: string;
  correctChoice: string;
  choices: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Guess {
  question_id?: number;
  category?: string;
  guess?: string;
  isCorrect?: boolean;
  user_id?: number;
  result_id?: number;
}

type id = number | null;

const GamePage = () => {
  const NUM_QUESTIONS = 5;
  const todayDate = new Date().toLocaleDateString().replace(/\//g, "-");
  const router = useRouter();
  const { data: session } = useSession();

  const [gameId, setGameId] = useState<id>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [arr, setArr] = useState<(number | null)[]>(new Array(5).fill(null));

  //reroute to result page if already played

  useEffect(() => {
    const checkIfPlayed = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/results/${session?.user.user_id}/${gameId}`
      );
      if (Object.keys(result.data).length) {
        router.push(`/results/${todayDate}`);
      } else {
        setLoading(false);
      }
    };
    if (session && gameId) {
      checkIfPlayed();
    }
  }, [gameId, session, router, todayDate]);

  useEffect(() => {
    const fetchData = async () => {
      const game = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/games?date=${todayDate}`
      );
      setGameId(game.data.game_id);
      setQuestions(game.data.questions);
      setCurrentQuestion(game.data.questions[0]);
    };
    fetchData();
  }, [todayDate]);

  const updateData = () => {
    if (
      !currentQuestion ||
      selectedOption === null ||
      !session?.user?.user_id
    ) {
      return;
    }

    const guess = currentQuestion.choices[selectedOption - 1];

    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses];
      newGuesses[count] = {
        question_id: currentQuestion.question_id,
        category: currentQuestion.category,
        guess,
        isCorrect: guess === currentQuestion.correctChoice,
        user_id: session.user.user_id,
      };
      return newGuesses;
    });
  };

  const handleAnswerNext = () => {
    if (selectedOption === null) return;

    const newArr = [...arr];
    newArr[count] = selectedOption;
    setArr(newArr);

    updateData();
    setSelectedOption(arr[count + 1]);
    setCurrentQuestion(questions[(count + 1) % NUM_QUESTIONS]);
    setCount((count + 1) % NUM_QUESTIONS);
  };

  const handleAnswerSubmit = async () => {
    if (
      !session?.user.user_id ||
      !gameId ||
      selectedOption === null ||
      !currentQuestion
    )
      return;

    const guess = currentQuestion.choices[selectedOption - 1];
    const finalGuesses = [...guesses];
    finalGuesses[count] = {
      question_id: currentQuestion.question_id,
      category: currentQuestion.category,
      guess,
      isCorrect: guess === currentQuestion.correctChoice,
      user_id: session.user.user_id,
    };

    const score = finalGuesses.reduce((score, guess) => {
      return guess.isCorrect ? score + 1 : score;
    }, 0);

    try {
      const reqBody = {
        user_id: session.user.user_id,
        game_id: gameId,
        score,
        date: todayDate,
        guesses: finalGuesses.filter((guess) => guess.question_id),
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/results/*/*`,
        reqBody
      );

      router.push(`/results/${todayDate}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    !loading && (
      <div className="flex justify-center items-center mt-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Question {count + 1}</h1>
          <p
            className={`font-semibold text-2xl mb-6 text-${CATEGORY_COLOR_MAP.get(
              currentQuestion?.category as string
            )}-600`}
          >
            {" "}
            Category: {currentQuestion?.category}
          </p>
          <p className="text-2xl mb-6">{currentQuestion?.question}</p>

          {/* Render answer choices as styled buttons */}
          <div className="flex flex-col gap-4 mb-6">
            {currentQuestion?.choices.map((choice, index) => (
              <button
                key={index}
                className={`text-xl py-3 px-5 border rounded-lg transition-colors duration-200 ${
                  selectedOption === index + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:bg-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={() =>
                  setSelectedOption(
                    selectedOption === index + 1 ? null : index + 1
                  )
                }
              >
                {choice}
              </button>
            ))}
          </div>

          <br />
          <div className="flex justify-center py-4">
            <button
              disabled={count === NUM_QUESTIONS - 1 && selectedOption === null}
              onClick={
                count < NUM_QUESTIONS - 1
                  ? handleAnswerNext
                  : handleAnswerSubmit
              }
              className={`text-white font-bold py-2 px-4 rounded ${
                count === NUM_QUESTIONS - 1 && selectedOption === null
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {count < NUM_QUESTIONS - 1 ? "Next Question" : "Submit Answers"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default GamePage;
