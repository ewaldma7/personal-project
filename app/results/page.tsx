'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface questionResult {
    id: Number,
    category: String,
    answeredCorrectly: boolean
}
interface Result {
    result_id: Number,
    user_id: Number,
    game_id: Number,
    answers: String[],
    score: Number
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

function ResultsPage() {

    const todayDate = new Date().toISOString();
    const [gameId, setGameId] = useState<id>(null);
    const userId = useSession().data?.user.user_id;
    const [result, setResult] = useState<Result | null>(null);
    const currDate = new Date().toLocaleDateString();
    const [score, setScore] = useState<number>(0);
    const [questions, setQuestions] = useState<Question[]>([]);

    const questionResults: questionResult[] = [
        { id: 1, category: 'History', answeredCorrectly: true },
        { id: 2, category: 'Science', answeredCorrectly: false },
        { id: 3, category: 'Geography', answeredCorrectly: true },
        { id: 4, category: 'Mathematics', answeredCorrectly: true },
        { id: 5, category: 'Literature', answeredCorrectly: false },
        { id: 6, category: 'Art', answeredCorrectly: true },
        { id: 7, category: 'Music', answeredCorrectly: false },
        { id: 8, category: 'Sports', answeredCorrectly: true },
        { id: 9, category: 'Movies', answeredCorrectly: true },
        { id: 10, category: 'Technology', answeredCorrectly: false },
    ];
    const totalScore = questionResults.filter((q) => q.answeredCorrectly).length;
    // Split questionResults into two columns
    const column1 = questionResults.slice(0, 5);
    const column2 = questionResults.slice(5, 10);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const gameResponse = await axios.get(`http://localhost:3000/api/games/${todayDate}`);
                    const gameData = gameResponse.data;
                    setGameId(gameData.game_id);
                    setQuestions(gameData.questions);
                    const resultResponse = await axios.get(`http://localhost:3000/api/results/${userId}/${gameData.game_id}`);
                    const resultData : Result = resultResponse.data;
                    setResult(resultData);
                    setScore(Number(resultData.score));
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [userId]);

    const renderColumn = (column: questionResult[]) => {
        return column.map((question, index) => (
            <div key={index} className="flex items-center justify-between px-6 py-4 bg-gray-100 border border-gray-200 rounded-md my-2">
                <div className="text-gray-600 font-semibold">{String(question.id)}.</div>
                <div className="pl-4">
                    <h3 className="text-lg font-semibold text-gray-800">Question {String(question.id)}:</h3>
                    <p className="text-sm text-gray-600">{question.category}</p>
                </div>
                <div className="flex-grow" />
                <p className="text-lg font-semibold text-gray-800">
                    {question.answeredCorrectly ? (
                        <span className="text-green-500">✔</span>
                    ) : (
                        <span className="text-red-500">❌</span>
                    )}
                </p>
            </div>
        ));
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Results: {currDate}</h2>
                    <p className="text-sm text-gray-600">Result</p>
                </div>
                <div className="flex">
                    {/* First Column */}
                    <div className="w-1/2 mx-2">{renderColumn(column1)}</div>
                    {/* Second Column */}
                    <div className="w-1/2 mr-2">{renderColumn(column2)}</div>
                </div>
                <div className="flex justify-center pt-4 pb-2">
                    <p className="text-lg font-semibold text-gray-800">
                        Total Score: {score}/{questions.length}
                    </p>
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
    );
}

export default ResultsPage;
