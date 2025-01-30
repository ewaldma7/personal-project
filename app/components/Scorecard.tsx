"use client";

import { Badge, Card, Center, Group, Text, Rating } from "@mantine/core";
import Link from "next/link";
import { IconCheck, IconPointFilled, IconMinus } from "@tabler/icons-react";
import { Guess } from "@prisma/client";
import { DAYS_OF_WEEK } from "@/constants";

interface ScorecardProps {
  result?: {
    result_id: number;
    user_id: number;
    game_id: number;
    guesses: Guess[];
    score: number;
    date: Date;
  };
  date: string;
}

const Scorecard: React.FC<ScorecardProps> = ({ result, date }) => {

  // Parse the date in local timezone
  const [year, month, day] = date.split("-").map(Number);
  const currDate = new Date(year, month - 1, day);

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
          {DAYS_OF_WEEK[currDate.getDay()]}
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
    <Link href={`/results/${date}`}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default Scorecard;
