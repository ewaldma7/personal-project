"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CATEGORY_COLOR_MAP } from "@/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import { getToday } from "../lib/dateUtils";
import { Question, Guess, Category } from "@prisma/client";
import { Badge } from "@mantine/core";

type id = number | null;
type PendingGuess = Omit<Guess, "id" | "result_id">;

const GamePage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [gameId, setGameId] = useState<id>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [guesses, setGuesses] = useState<PendingGuess[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [arr, setArr] = useState<(number | null)[]>([]);
  const todayDate = getToday();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const game = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/games?date=${todayDate}`
        );
        setGameId(game.data.game_id);
        setQuestions(game.data.questions);
        setCurrentQuestion(game.data.questions[0]);
        setArr(new Array(game.data.questions.length).fill(null));

        if (session && game.data.game_id) {
          const result = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/results/${session.user.user_id}/${game.data.game_id}`
          );
          if (Object.keys(result.data).length) {
            router.push(`/results/${todayDate}`);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [todayDate, session, router]);

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
        category: currentQuestion.category as Category,
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
    setCurrentQuestion(questions[(count + 1) % questions.length]);
    setCount((count + 1) % questions.length);
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
      category: currentQuestion.category as Category,
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
              Question {count + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(count / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Category badge */}
        <div className="flex justify-center mb-8">
          <Badge
            size="xl"
            variant="outline"
            color={CATEGORY_COLOR_MAP.get(currentQuestion?.category as string)}
          >
            {currentQuestion?.category}
          </Badge>
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
            disabled={count === questions.length - 1 && selectedOption === null}
            onClick={
              count < questions.length - 1
                ? handleAnswerNext
                : handleAnswerSubmit
            }
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedOption === null
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {count < questions.length - 1 ? (
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
