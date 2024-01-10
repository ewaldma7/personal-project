import React from 'react'
import Scorecard from './Scorecard'

interface Result {
    result_id: Number;
    user_id: Number;
    game_id: Number;
    answers: String[];
    score: Number;
    date: String;
}

interface Props {
    results: Result[];
}

const PastGames: React.FC<Props> = ({results}) => {
  return (
    <>
    <p className="text-xl text-gray-600 mt-10 mb-4 text-center">Past Games</p>
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