'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import axios from 'axios'
import PastGames from '../components/PastGames'
import { Button, Container, Text, Title } from '@mantine/core'

const Dashboard = () => {

  interface Result {
    result_id: number;
    user_id: number;
    game_id: number;
    answers: string[];
    score: number;
    date: string;
}

  function convertDate(date: Date) {
    return date.toLocaleDateString().replace(/\//g, '-');
  }

  const { data: session } = useSession();
  const [played, setPlayed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const previousDates = getPreviousDates();

  function getPreviousDates() {
    let dates = [];
    for (let i = 0; i <= 4; i++) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      dates.push(currentDate);
    }
    return dates;
  }

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results/${session.user.user_id}/*`);
          setResults(results.data);
          setPlayed(results.data.length > 0 && (results.data[0].date === convertDate(previousDates[0])))
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [session, previousDates]);

  useEffect(() => {
    if (played != null) setLoaded(true);
  }, [played])



  return session && loaded ? (
    <Container className="min-h-screen flex flex-col justify-start items-center pt-16">
      {/* Title */}
      <Container className='mb-5'>
      <Title fw={800}>Welcome {session?.user.name}!</Title>
      </Container>
      <Container className='mb-5'>
      <Text  size='xl'>Today&#39;s Date: {previousDates[0].toLocaleDateString()}</Text>
      </Container>
      
      {/* Final button */}
      <Link href={played ? `/results/${convertDate(previousDates[0])}` : "/play"}>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded text-3xl">
      {played ? 'View Results' : 'Play'}
      </button>
      </Link>
      
      {/* Past Games section */}
      {results?.length > 0 && <PastGames results={results} />}
    </Container>
  ) : "";
  
}

export default Dashboard