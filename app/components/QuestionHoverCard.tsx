'use client'

import React from 'react'
import { Text, Link, Flex, Avatar, Box, Heading, HoverCard, HoverCardRoot, HoverCardTrigger, HoverCardContent } from '@radix-ui/themes'

interface Question {
    question_id: number;
    question: string;
    answer: string;
    category: string;
    createdAt: Date;
    updatedAt: Date | null;
}
interface QuestionObject extends Question {
    guessed: string;
    index: number;
}

interface Props {
    questionObject: QuestionObject,
}

const QuestionHoverCard: React.FC<Props> = ({ questionObject }) => {

    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <div key={questionObject.index} className="flex items-center justify-between px-6 py-4 bg-gray-100 border border-gray-200 rounded-md my-2">
                    <div className="text-gray-600 font-semibold">{questionObject.index + 1}.</div>
                    <div className="pl-4">
                        <h3 className="text-lg font-semibold text-gray-800">{questionObject.question}</h3>
                        <p className="text-sm text-gray-600">{questionObject.category}</p>
                    </div>
                    <div className="flex-grow" />
                    <p className="text-lg font-semibold text-gray-800">
                        {questionObject.guessed.toLowerCase() === questionObject.answer.toLowerCase() ? (
                            <span className="text-green-500">✔</span>
                        ) : (
                            <span className="text-red-500">❌</span>
                        )}
                    </p>
                </div>
            </HoverCard.Trigger>
            <HoverCard.Content size="3" className="p-4 rounded-lg shadow-m">
                <div className="text-center">
                    <p className="text-gray-700">
                        <span className="font-semibold">Your Guess:</span> {questionObject.guessed}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Correct Answer:</span> {questionObject.answer}
                    </p>
                </div>
            </HoverCard.Content>

        </HoverCard.Root>
    )
}

export default QuestionHoverCard
//red: f0a1a1
//green: 