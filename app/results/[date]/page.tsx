'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';


interface Result {
    result_id: Number;
    user_id: Number;
    game_id: Number;
    answers: String[];
    score: Number;
    guesses: Guess[];
}

interface Guess {
    id: Number;
    user_id: Number;
    question_id: Number;
    result_id: Number;
    guess: String;
    isCorrect: boolean;
}
interface Question {
    question_id: number;
    question: string;
    answer: string;
    category: string;
    createdAt: Date;
    updatedAt: Date | null;
}

type id = number | null

function ResultsPage({params} : {params: {date: string}}) {

    const userId = useSession().data?.user.user_id;
    const [result, setResult] = useState<Result | null>(null);
    const currDate = new Date(params.date);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [guesses, setGuesses] = useState<Guess[] | undefined>([]);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const gameResponse = await axios.get(`http://localhost:3000/api/games/${currDate.toLocaleDateString().replace(/\//g, '-')}`);
                    const gameData = gameResponse.data;
                    setQuestions(gameData.questions);
                    const resultResponse = await axios.get(`http://localhost:3000/api/results/${userId}/${gameData.game_id}`);
                    const resultData: Result = resultResponse.data;
                    setResult(resultData);
                    setGuesses(resultData.guesses);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [userId]);

    return guesses?.length !== 0 ? (
        <div className="max-w-xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Results: {currDate.toLocaleDateString()}</h2>
                    <p className="text-sm text-gray-600">Result</p>
                </div>
                <div className="flex justify-center pt-4 pb-2">
                    <p className="text-lg font-semibold text-gray-800">
                        Total Score: {String(result?.score)}/{questions.length}
                    </p>
                </div>
                <div className="flex flex-col items-center pb-4">
                    {guesses?.map((guess) => (
                        <div key={guess.id as any} className="bg-gray-100 my-2 p-4 rounded">
                            <p className="text-gray-700">Question: {questions.find(q => q.question_id === guess.question_id)?.question}</p>
                            <p className={`text-${guess.isCorrect ? 'green' : 'red'}-500 font-semibold`}>
                                Your Guess: {guess.guess} ({guess.isCorrect ? 'Correct' : 'Incorrect'})
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center py-4">
                    <Link href="/dashboard">
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 mb-2 px-4 rounded">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    ) : "";
}

export default ResultsPage;
