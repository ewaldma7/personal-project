'use client'

import React from 'react'
import Scorecard from './Scorecard'
import { Text } from '@mantine/core';
import { Guess } from '@prisma/client';

interface Result {
    result_id: number;
    user_id: number;
    game_id: number;
    guesses: Guess[];
    score: number;
    date: string;
}

interface Props {
    results: Result[];
}

const PastGames: React.FC<Props> = ({results}) => {
  return (
    <>
    <div className='mt-10 mb-5'>
    <Text size='xl' fw='800'>Past Games</Text>
    </div>
      <div className="flex items-center gap-4">
        {results.map(result => (
          <Scorecard
            key={String(result.result_id)}
            result={result}
          />
        ))}
      </div>
      </>
  )
}

export default PastGames