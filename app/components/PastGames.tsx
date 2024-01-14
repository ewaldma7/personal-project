import React from 'react'
import Scorecard from './Scorecard'
import { Text } from '@mantine/core';

interface Result {
    result_id: number;
    user_id: number;
    game_id: number;
    answers: string[];
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
            key={String(result.game_id) + String(result.user_id)}
            score={String(result.score)}
            date={result.date}
          />
        ))}
      </div>
      </>
  )
}

export default PastGames