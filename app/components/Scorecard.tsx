"use client";

import { Badge, Card, Center, Group, Text, Rating } from "@mantine/core";
import Link from "next/link";
import { IconCheck, IconPointFilled, IconMinus } from "@tabler/icons-react";
import { Guess } from "@prisma/client";

interface ScorecardProps {
  result?: {
    result_id: number;
    user_id: number;
    game_id: number;
    guesses: Guess[];
    score: number;
    date: string;
  };
  date: string;
}

const Scorecard: React.FC<ScorecardProps> = ({ result, date }) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currDate = new Date(date);
  const getIcon = (value: number) => {
    if (!result) {
      return <IconMinus size="1.5rem" color="#495057" />;
    }
    return result?.guesses.at(value - 1)?.isCorrect ? (
      <IconCheck size="1.5rem" color="green" />
    ) : (
      <IconPointFilled size="1.5rem" color={result ? "black" : "gray"} />
    );
  };

  const CardContent = () => (
    <Card
      shadow="sm"
      padding="lg"
      style={{
        border: result ? "2px solid #A7F6EC" : "2px solid #E9ECEF",
        cursor: result ? "pointer" : "default",
        transition: "transform 0.2s, background-color 0.2s",
        maxWidth: "250px",
        opacity: result ? 1 : 0.75,
        backgroundColor: result ? "white" : "#F1F3F5",
      }}
      className={
        result
          ? "hover:bg-slate-100 hover:shadow-lg hover:transform hover:scale-105"
          : ""
      }
    >
      <Center>
        <Text
          variant={result ? "gradient" : "text"}
          fw={800}
          size="lg"
          tt="uppercase"
          c={result ? undefined : "#495057"}
        >
          {daysOfWeek[currDate.getDay()]}
        </Text>
      </Center>
      <Group mt="md" mb="xs">
        <Badge
          size="lg"
          variant="filled"
          color={result ? "teal" : "dark"}
          fw={800}
          className="mx-auto"
        >
          {date}
        </Badge>
        <Rating
          emptySymbol={getIcon}
          fullSymbol={getIcon}
          readOnly
          className="mx-auto"
        />
      </Group>
    </Card>
  );

  return result ? (
    <Link href={`/results/${result.date.replace(/\//g, "-")}`}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default Scorecard;
