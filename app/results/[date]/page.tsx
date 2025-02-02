"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Text, Accordion, Title, Badge, Grid } from "@mantine/core";
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
    return (
      <Grid className="w-full px-2 sm:px-4">
        <Grid.Col span={{ base: 2, sm: 1 }}>
          <div
            className={`
            w-8 h-8 flex items-center justify-center rounded-md
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
        </Grid.Col>
        <Grid.Col span={{ base: 10, sm: 9 }}>
          <Text size="xl" className="text-gray-800">
            {
              questions.find(
                (question) => question.question_id === guess.question_id
              )?.question
            }
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 1, sm: 1 }}>
          <Badge
            variant="light"
            size="lg"
            color={CATEGORY_COLOR_MAP.get(guess.category)}
          >
            {guess.category}
          </Badge>
        </Grid.Col>
      </Grid>
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
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
            <Text className="text-gray-700 font-medium w-32">Your Answer:</Text>
            <Badge
              size="lg"
              variant="light"
              color={guess.isCorrect ? "green" : "red"}
              className="font-medium"
            >
              {guess.guess}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
            <Text className="text-gray-700 font-medium w-32">
              Correct Answer:
            </Text>
            <Badge
              size="lg"
              color="green"
              className="font-medium"
              variant="light"
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

  return loading ? (
    <LoadingSpinner />
  ) : guesses?.length !== 0 ? (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mx-4 sm:mx-auto mb-12">
        <Title className="text-2xl sm:text-3xl mb-6 text-gray-800 text-center">
          Results For: {params.date}
        </Title>
        <Accordion chevronPosition="right" className="my-4">
          {items}
        </Accordion>
        <Title className="text-xl sm:text-2xl mb-6 text-center text-gray-800">
          Final Score: {String(result?.score)}
        </Title>
        <div className="flex justify-center mt-8">
          <Link href="/dashboard">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ResultsPage;
