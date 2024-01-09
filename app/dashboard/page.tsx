'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import axios from 'axios'
import Scorecard from '../components/Scorecard'

const Dashboard = () => {

  interface Result {
    result_id: Number;
    user_id: Number;
    game_id: Number;
    answers: String[];
    score: Number;
    date: String;
}

  function convertDate(date: Date) {
    return date.toLocaleDateString().replace(/\//g, '-');
  }

  const { data: session } = useSession();
  const [played, setPlayed] = useState(false);
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
          const results = await axios.get(`http://localhost:3000/api/results/${session.user.user_id}/*`);
          setResults(results.data);
          console.log(results.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    if (results.length > 0 && (results[0].date === convertDate(previousDates[0]))) {
      setPlayed(true);
    }
    setLoaded(true);
  }, [results])



  return session && loaded ? (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16">
      {/* Title */}
      <h1 className="text-6xl font-bold mb-12 text-gray-800">Welcome {session?.user.name}!</h1>
      <p className="text-xl text-gray-600 mb-12">Today's Date: {previousDates[0].toLocaleDateString()}</p>
      {/* Two larger buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-12">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-8 px-16 rounded-xl mb-4 md:mb-0 md:mr-8 text-xl">
          Yesterday's Answers
        </button>
        <Link href="/leaderboard">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-8 px-16 rounded-xl text-xl">
          View Today's Leaderboard
        </button>
        </Link>
      </div>
      
      {/* Final button */}
      <Link href={played ? `/results/${convertDate(previousDates[0])}` : "/play"}>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-8 px-16 rounded-xl text-xl">
        {played ? 'View Results' : 'Play'}
      </button>
      </Link>
      <p className="text-xl text-gray-600 mt-12 text-center">Past Games</p>
      <div className="flex justify-center gap-8">
      {results.map(result => <Scorecard key={String(result.game_id) + String(result.user_id)} score={String(result.score)} date={result.date}/>)}
      </div>
    </div>
  ) : ""
}

export default Dashboard