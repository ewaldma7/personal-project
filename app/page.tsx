'use client'
import React from 'react';
import Link from 'next/link';

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Daily Trivia Game</h1>
        <p className="text-lg mb-6 text-gray-600">
          Compete with friends, answer daily trivia, and have fun!
        </p>
        <div className="mb-8">
          <Link href="/login">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </Link>
        </div>
        <p className="text-lg text-gray-600">
          Start playing now and challenge your knowledge!
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
