'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import axios from 'axios'
import Scorecard from '../components/Scorecard'

const Dashboard = () => {

  const { data: session } = useSession();
  const [played, setPlayed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const todayDate = new Date();
  const previousDates = getPreviousDates();

  function getPreviousDates() {
    let dates = [];
    for (let i = 0; i <= 4; i++) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      dates.push(currentDate.toLocaleDateString());
    }
    return dates;
  }

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const gameResponse = await axios.get(`http://localhost:3000/api/games/${todayDate.toISOString()}`);
          const resultResponse = await axios.get(`http://localhost:3000/api/results/${session.user.user_id}/${gameResponse.data.game_id}`);
          if (Object.keys(resultResponse.data).length !== 0) {
            setPlayed(true);
          }
          setLoaded(true);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [session]);

  return session && loaded ? (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16">
      {/* Title */}
      <h1 className="text-6xl font-bold mb-12 text-gray-800">Welcome {session?.user.name}!</h1>
      <p className="text-xl text-gray-600 mb-12">Today's Date: {previousDates[0]}</p>
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
      <Link href={played ? `/results/${todayDate.toLocaleDateString().replace(/\//g, '-')}` : "/play"}>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-8 px-16 rounded-xl text-xl">
        {played ? 'View Results' : 'Play'}
      </button>
      </Link>
      <p className="text-xl text-gray-600 mt-12 text-center">Past Games</p>
      <div className="flex justify-center gap-8">
      {previousDates.map(date => <Scorecard key={date} score='5' date={date}/>)}
      </div>
    </div>
  ) : ""
}

export default Dashboard