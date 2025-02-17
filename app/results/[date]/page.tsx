"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Text, Accordion, Badge } from "@mantine/core";
import { CATEGORY_COLOR_MAP } from "@/constants";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Guess, Question, Result } from "@prisma/client";
import { IconCheck, IconX } from "@tabler/icons-react";

interface ExtendedResult extends Result {
  guesses: Guess[];
}

function ResultsPage({ params }: { params: { date: string } }) {
  const userId = useSession().data?.user.user_id;
  const [result, setResult] = useState<Result | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [guesses, setGuesses] = useState<Guess[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function AccordionLabel({ guess }: { guess: Guess }) {
    const question = questions.find(
      (q) => q.question_id === guess.question_id
    )?.question;

    return (
      <div className="w-full flex flex-col gap-2 px-2 sm:px-4">
        <div className="flex flex-col items-center w-full pl-12">
          <Badge
            variant="light"
            size="lg"
            color={CATEGORY_COLOR_MAP.get(guess.category)}
            className="whitespace-nowrap"
          >
            {guess.category}
          </Badge>
        </div>
        <div className="w-full border-t border-gray-300 mt-2"></div>

        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`
            min-w-8 h-8 flex items-center justify-center rounded-md shrink-0
            ${
              guess.isCorrect
                ? "bg-emerald-100/80 text-emerald-600"
                : "bg-red-100/80 text-red-600"
            }
          `}
          >
            {guess.isCorrect ? (
              <IconCheck size={20} stroke={2} />
            ) : (
              <IconX size={20} stroke={2} />
            )}
          </div>

          <div className="flex-1 min-w-0 py-1">
            <Text size="lg" className="text-gray-800 break-words">
              {question}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const items = guesses?.map((guess: Guess) => (
    <Accordion.Item
      value={String(guess.id)}
      key={String(guess.id)}
      className="border border-gray-300 rounded-lg mb-4 overflow-hidden shadow-sm"
    >
      <Accordion.Control className="hover:bg-gray-100/50">
        <AccordionLabel guess={guess} />
      </Accordion.Control>
      <Accordion.Panel className="bg-gray-100/50 border-t border-gray-300">
        <div className="p-4 space-y-6">
          <div className="flex flex-col space-y-2">
            <Text className="text-gray-700 font-medium">Your Answer:</Text>
            <Badge
              size="lg"
              variant="light"
              color={guess.isCorrect ? "green" : "red"}
              className="font-medium self-start"
            >
              {guess.guess}
            </Badge>
          </div>

          <div className="flex flex-col space-y-2">
            <Text className="text-gray-700 font-medium">Correct Answer:</Text>
            <Badge
              size="lg"
              color="green"
              variant="light"
              className="font-medium self-start"
            >
              {guess.isCorrect
                ? guess.guess
                : questions.find(
                    (question) => question.question_id === guess.question_id
                  )?.correctChoice}
            </Badge>
          </div>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  useEffect(() => {
    if (new Date(params.date) > new Date()) {
      router.push("/dashboard");
    } else if (userId) {
      const fetchData = async () => {
        try {
          const gameResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/games/?date=${params.date}`
          );
          const gameData = gameResponse.data;
          setQuestions(gameData.questions);
          const resultResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/results/${userId}/${gameData.game_id}`
          );
          const resultData: ExtendedResult = resultResponse.data;
          if (Object.keys(resultData).length === 0) {
            router.push("/dashboard");
          } else {
            setResult(resultData);
            setGuesses(resultData.guesses);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId, params.date, router]);

  if (loading) return <LoadingSpinner />;
  if (!guesses?.length) return null;

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto mb-8 sm:mb-12">
        <span className="block text-xl sm:text-2xl lg:text-3xl mb-6 text-gray-800 text-center font-bold">
          Results For: {params.date}
        </span>

        <Accordion chevronPosition="right" className="my-4">
          {items}
        </Accordion>

        <span className="block text-lg sm:text-xl lg:text-2xl mb-6 text-center text-gray-800 font-bold">
          Final Score: {String(result?.score)}
        </span>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/dashboard">
            <button className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
