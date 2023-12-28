'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const UserPostPage = () => {

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [played, setPlayed] = useState(false);
  const currDate = new Date().toLocaleDateString();

  return session ? (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16">
      {/* Title */}
      <h1 className="text-6xl font-bold mb-12 text-gray-800">Welcome {session?.user.name}!</h1>
      <p className="text-xl text-gray-600 mb-12">Today's Date: {currDate}</p>
      {/* Two larger buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-12">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-8 px-16 rounded-xl mb-4 md:mb-0 md:mr-8 text-xl">
          Yesterday's Answers
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-8 px-16 rounded-xl text-xl">
          View Today's Leaderboard
        </button>
      </div>
      
      {/* Final button */}
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-8 px-16 rounded-xl text-xl">
        Play
      </button>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default UserPostPage