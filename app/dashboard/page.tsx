"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { IconCrown } from "@tabler/icons-react";
import { Result, Guess } from "@prisma/client";
import { Title } from "@mantine/core";
import LoadingSpinner from "../components/LoadingSpinner";
import PastGames from "../components/PastGames";
import StatsCards from "../components/StatsCards";
import {
  formatDate,
  isSameDay,
  getPreviousDays,
  parseDate,
} from "@/app/lib/dateUtils";

interface ExtendedResult extends Result {
  guesses: Guess[];
}

const Dashboard = () => {
  const { data: session } = useSession();
  const [played, setPlayed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState<ExtendedResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [winRate, setWinRate] = useState(0);

  const previousDates = useMemo(() => {
    const currentDate = new Date();
    return getPreviousDays(currentDate, 7).map((dateStr) => parseDate(dateStr));
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
              isSameDay(results.data[0].date, previousDates[0])
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
        if (results.find((r) => isSameDay(r.date, previousDates[i]))) {
          currentStreak++;
        } else if (i !== 0) {
          break;
        }
      }
      setStreak(currentStreak);
    }
  }, [results, previousDates]);

  return session && loaded ? (
    <div className="min-h-screen flex flex-col items-center pt-6 px-4 sm:px-8 md:px-16 lg:px-24">
      <IconCrown
        className="w-24 h-24 mb-8"
        stroke={1.5}
        color="var(--mantine-color-yellow-filled)"
      />

      <Title className="font-extrabold mb-12">
        Welcome {session?.user.name}!
      </Title>

      <StatsCards results={results} streak={streak} winRate={winRate} />

      <Link
        href={played ? `/results/${formatDate(previousDates[0])}` : "/play"}
      >
        <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-4 px-8 rounded-lg text-xl mb-12 transition-all">
          {played ? "View Today's Results" : "Play Today's Game"}
        </button>
      </Link>

      <div className="w-full max-w-6xl">
        <PastGames
          results={results}
          previousDates={previousDates.map((date) => formatDate(date))}
        />
      </div>
    </div>
  ) : (
    <LoadingSpinner />
  );
};

export default Dashboard;
