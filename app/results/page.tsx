'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import QuestionHoverCard from '../components/QuestionHoverCard';

interface QuestionObject extends Question {
    guessed: string;
    index: number;
}

interface Result {
    result_id: Number;
    user_id: Number;
    game_id: Number;
    answers: String[];
    score: Number;
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
    const [questionObjects, setQuestionObjects] = useState<QuestionObject[]>([]);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const gameResponse = await axios.get(`http://localhost:3000/api/games/${todayDate}`);
                    const gameData = gameResponse.data;
                    setGameId(gameData.game_id);
                    setQuestions(gameData.questions);
                    const resultResponse = await axios.get(`http://localhost:3000/api/results/${userId}/${gameData.game_id}`);
                    const resultData: Result = resultResponse.data;
                    setResult(resultData);
                    setScore(Number(resultData.score));
                    const questionObjectsWithAnswers : QuestionObject[] = gameData.questions.map((question: Question, index: number) => {
                        const guessedAnswer = resultData.answers[index];
                        return {
                            index,
                            ...question,
                            guessed: guessedAnswer || ''
                        };
                    });
                    setQuestionObjects(questionObjectsWithAnswers);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [userId]);

    const renderResults = (objects: QuestionObject[]) => {
        return objects.map(obj => (<QuestionHoverCard key={obj.index} questionObject={obj}/>));
    };

    return questionObjects.length !== 0 ?
        <div className="max-w-xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Results: {currDate}</h2>
                    <p className="text-sm text-gray-600">Result</p>
                </div>
                <div className="flex">
                    <div className="w-1/1 mx-2 my-2">{renderResults(questionObjects)}</div>
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
        : ""
}

export default ResultsPage;
