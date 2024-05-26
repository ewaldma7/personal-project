'use client'

import { Badge, Card, Center, Group, Text, Rating } from '@mantine/core';
import Link from 'next/link';
import { IconCheck, IconPointFilled } from '@tabler/icons-react';
import { Guess } from '@prisma/client';

interface ScorecardProps {
  result: {
    result_id: number;
    user_id: number;
    game_id: number;
    guesses: Guess[];
    score: number;
    date: string;
}
}

const Scorecard: React.FC<ScorecardProps> = ({ result }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currDate = new Date(result.date);
  const getIcon = (value: number) => {
    return result.guesses.at(value - 1)?.isCorrect ? <IconCheck size="1.5rem" color='green'/> : <IconPointFilled size="1.5rem"/>
  }

  return (
    <Link href={`/results/${result.date.replace(/\//g, '-')}`}>
      <Card
        shadow="sm"
        padding="lg"
        style={{
          border: '2px solid #A7F6EC',
          cursor: 'pointer',
          transition: 'transform 0.2s, background-color 0.2s',
          maxWidth: '250px'
        }}
        className="hover:bg-slate-100 hover:shadow-lg hover:transform hover:scale-105"
      >
        <Center>
          <Text variant="gradient"fw={800} size="lg" tt="uppercase">
            {daysOfWeek[currDate.getDay()]}
          </Text>
        </Center>
        <Group  mt="md" mb="xs">
          <Badge size="lg" variant="filled" color="teal" fw={800} className='mx-auto'>
            {result.date}
          </Badge>
          <Rating emptySymbol={getIcon} fullSymbol={getIcon} className='mx-auto' />
        </Group>
      </Card>
    </Link>
  );
}

export default Scorecard;