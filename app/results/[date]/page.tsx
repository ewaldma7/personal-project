"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Avatar,
  Text,
  Accordion,
  Button,
  Title,
  Badge,
  Grid,
} from "@mantine/core";
import { CATEGORY_COLOR_MAP } from "@/constants";

interface Result {
  result_id: Number;
  user_id: Number;
  game_id: Number;
  answers: String[];
  score: Number;
  guesses: Guess[];
}

interface Guess {
  id: Number;
  user_id: Number;
  question_id: Number;
  result_id: Number;
  guess: String;
  category: string;
  isCorrect: boolean;
}
interface Question {
  question_id: number;
  question: string;
  correctChoice: string;
  answer: string;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface AccLabelProps {
  guess: Guess;
}

function ResultsPage({ params }: { params: { date: string } }) {
  const userId = useSession().data?.user.user_id;
  const [result, setResult] = useState<Result | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [guesses, setGuesses] = useState<Guess[] | undefined>([]);

  function AccordionLabel({ guess }: AccLabelProps) {
    return (
      <Grid className="ml-5">
        <Grid.Col span={1}>
          <Avatar
            variant="filled"
            radius="xl"
            size="md"
            color={guess.isCorrect ? "green" : "red"}
          >
            {" "}
          </Avatar>
        </Grid.Col>
        <Grid.Col span={9}>
          <Text size="xl">
            {
              questions.find(
                (question) => question.question_id === guess.question_id
              )?.question
            }
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Badge size="lg" color={CATEGORY_COLOR_MAP.get(guess.category)}>
            {guess.category}
          </Badge>
        </Grid.Col>
      </Grid>
    );
  }

  const items = guesses?.map((guess: Guess) => (
    <Accordion.Item value={String(guess.id)} key={String(guess.id)}>
      <Accordion.Control>
        <AccordionLabel guess={guess} />
      </Accordion.Control>
      <Accordion.Panel>
        <Grid className="ml-5">
          <Grid.Col span={2}>
            <Text size="xl" fw={700}>
              Your Guess:
            </Text>
          </Grid.Col>
          <Grid.Col span={10}>
            <Badge size="xl" color={guess.isCorrect ? "green" : "red"}>
              {guess.guess}
            </Badge>
          </Grid.Col>
          <Grid.Col span={2}>
            <Text size="xl" fw={700}>
              Correct Answer:
            </Text>
          </Grid.Col>
          <Grid.Col span={10}>
            <Badge size="xl" color="green">
              {guess.isCorrect
                ? guess.guess
                : questions.find(
                    (question) => question.question_id === guess.question_id
                  )?.correctChoice}
            </Badge>
          </Grid.Col>
        </Grid>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const currDate = new Date(params.date);
          const gameResponse = await axios.get(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/games/?date=${currDate.toLocaleDateString()}`
          );
          const gameData = gameResponse.data;
          setQuestions(gameData.questions);
          const resultResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/results/${userId}/${gameData.game_id}`
          );
          const resultData: Result = resultResponse.data;
          setResult(resultData);
          setGuesses(resultData.guesses);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [userId, params.date]);

  return guesses?.length !== 0 ? (
    <div className=" justify-center items-center ml-20">
      <Title>Results For: {params.date}</Title>
      <Accordion
        chevronPosition="right"
        variant="contained"
        className="mb-5 mt-5 max-w-7xl"
      >
        {items}
      </Accordion>
      <Title>Score: {String(result?.score)}</Title>
      <div className="flex justify-center py-4">
        <Link href="/dashboard">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ResultsPage;
