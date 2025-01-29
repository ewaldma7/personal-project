"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CATEGORY_COLOR_MAP } from "@/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import { getToday } from "../lib/dateUtils";

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
  const todayDate = getToday();

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

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {count + 1} of {NUM_QUESTIONS}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(count / NUM_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Category badge */}
        <div className="flex justify-center mb-8">
          <span
            style={{
              backgroundColor: `${CATEGORY_COLOR_MAP.get(
                currentQuestion?.category as string
              )}15`,
              color: CATEGORY_COLOR_MAP.get(
                currentQuestion?.category as string
              ),
              border: `2px solid ${CATEGORY_COLOR_MAP.get(
                currentQuestion?.category as string
              )}`,
              boxShadow: `0 2px 8px ${CATEGORY_COLOR_MAP.get(
                currentQuestion?.category as string
              )}25`,
            }}
            className="inline-flex items-center px-6 py-2 rounded-full text-base font-semibold transform transition-transform hover:scale-105"
          >
            {currentQuestion?.category}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {currentQuestion?.question}
        </h2>

        {/* Answer choices */}
        <div className="space-y-3 mb-8">
          {currentQuestion?.choices.map((choice, index) => (
            <button
              key={index}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                selectedOption === index + 1
                  ? "bg-blue-500 text-white shadow-lg transform scale-102"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              onClick={() =>
                setSelectedOption(
                  selectedOption === index + 1 ? null : index + 1
                )
              }
            >
              <div className="flex items-center">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    selectedOption === index + 1
                      ? "bg-white text-blue-500"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg">{choice}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation button */}
        <div className="flex justify-center">
          <button
            disabled={count === NUM_QUESTIONS - 1 && selectedOption === null}
            onClick={
              count < NUM_QUESTIONS - 1 ? handleAnswerNext : handleAnswerSubmit
            }
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedOption === null
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {count < NUM_QUESTIONS - 1 ? (
              <span className="flex items-center">
                Next Question
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            ) : (
              "Submit Answers"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
