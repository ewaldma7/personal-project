"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import PastGames from "../components/PastGames";
import { Text, Title } from "@mantine/core";
import { IconCrown } from "@tabler/icons-react";
import { Result, Guess } from "@prisma/client";
import LoadingSpinner from '../components/LoadingSpinner';

interface ExtendedResult extends Result {
  guesses: Guess[];
}

const Dashboard = () => {
  function convertDate(date: Date) {
    return date.toLocaleDateString().replace(/\//g, "-");
  }

  const { data: session } = useSession();
  const [played, setPlayed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState<ExtendedResult[]>([]);

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

  return session && loaded ? (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16 px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Title */}
      <IconCrown
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mb-8"
        stroke={1.5}
        color="var(--mantine-color-yellow-filled)"
      />
      <div className="mb-8 text-center">
        <Title className="font-extrabold">Welcome {session?.user.name}!</Title>
      </div>
      <div className="mb-8 text-center">
        <Text size="xl" fw="300">
          Today{`'`}s Date: {previousDates[0].toLocaleDateString()}
        </Text>
      </div>

      {/* Final button */}
      <Link
        href={played ? `/results/${convertDate(previousDates[0])}` : "/play"}
      >
        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded text-xl sm:text-2xl md:text-3xl">
          {played ? "View Results" : "Play"}
        </button>
      </Link>

      <div className="w-full max-w-4xl">
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
