"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import PastGames from "../components/PastGames";
import { Text, Title, Paper, Group, RingProgress } from "@mantine/core";
import {
  IconCrown,
  IconTrophy,
  IconChartBar,
  IconFlame,
} from "@tabler/icons-react";
import { Result, Guess } from "@prisma/client";
import LoadingSpinner from "../components/LoadingSpinner";

interface ExtendedResult extends Result {
  guesses: Guess[];
}

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const Dashboard = () => {
  function convertDate(date: Date) {
    return date.toLocaleDateString().replace(/\//g, "-");
  }

  const { data: session } = useSession();
  const [played, setPlayed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState<ExtendedResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [winRate, setWinRate] = useState(0);

  function getPreviousDates(currentDate: Date) {
    let dates = [];
    for (let i = 0; i <= 6; i++) {
      let date = new Date();
      date.setDate(currentDate.getDate() - i);
      dates.push(date);
    }
    return dates;
  }

  const previousDates = useMemo(() => {
    const currentDate = new Date();
    return getPreviousDates(currentDate);
  }, []);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const results = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/results/${session.user.user_id}/*`
          );
          setResults(results.data);
          setPlayed(
            results.data.length > 0 &&
              results.data[0].date === convertDate(previousDates[0])
          );
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [session, previousDates]);

  useEffect(() => {
    if (played != null) setLoaded(true);
  }, [played]);

  useEffect(() => {
    if (results.length > 0) {
      // Calculate win rate
      const wins = results.filter((r) => r.score >= 3).length;
      setWinRate((wins / results.length) * 100);

      // Calculate streak
      let currentStreak = 0;
      const dates = previousDates.map((d) => d.toLocaleDateString());
      for (let i = 0; i < dates.length; i++) {
        if (results.find((r) => r.date === convertDate(previousDates[i]))) {
          currentStreak++;
        } else break;
      }
      setStreak(currentStreak);
    }
  }, [results, previousDates]);

  const stats: StatsCard[] = [
    {
      title: "Games Played",
      value: results.length,
      icon: <IconChartBar size={32} />,
      description: "Total games completed",
    },
    {
      title: "Current Streak",
      value: streak,
      icon: <IconFlame size={32} color="orange" />,
      description: "Consecutive days played",
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      icon: <IconTrophy size={32} color="gold" />,
      description: "Games with 3+ correct answers",
    },
  ];

  return session && loaded ? (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 sm:px-8 md:px-16 lg:px-24">
      <IconCrown
        className="w-24 h-24 mb-8"
        stroke={1.5}
        color="var(--mantine-color-yellow-filled)"
      />

      <Title className="font-extrabold mb-12">
        Welcome {session?.user.name}!
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        {stats.map((stat, index) => (
          <Paper
            key={index}
            shadow="sm"
            radius="md"
            p="xl"
            className="hover:shadow-md transition-shadow"
          >
            <Group>
              {stat.icon}
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {stat.title}
                </Text>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {stat.description}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </div>

      <Link
        href={played ? `/results/${convertDate(previousDates[0])}` : "/play"}
      >
        <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-4 px-8 rounded-lg text-xl mb-12 transition-all">
          {played ? "View Today's Results" : "Play Today's Game"}
        </button>
      </Link>

      <div className="w-full max-w-6xl">
        <PastGames
          results={results}
          previousDates={previousDates.map((date) => convertDate(date))}
        />
      </div>
    </div>
  ) : (
    <LoadingSpinner />
  );
};

export default Dashboard;
