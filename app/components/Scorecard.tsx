'use client'

import { Badge, Card, Center, Group, Text } from '@mantine/core';
import Link from 'next/link';

interface ScorecardProps {
  score: string;
  date: string;
}

const Scorecard: React.FC<ScorecardProps> = ({ score, date }) => {
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const currDate = new Date(date);

  return (
    <Link href={`/results/${date.replace(/\//g, '-')}`}>
      <Card
        style={{
          border: `solid 2px #A7F6EC`,
          display: 'inline-block',
          margin: '0 8px 8px 0', // Adjust margin as needed for spacing
        }}
        className="rounded-full cursor-pointer hover:bg-slate-200"
      >
        <Center>
        <Text variant="gradient"  fw={800}>{daysOfWeek[currDate.getDay()]}</Text>
        </Center>
        <Group justify="space-between" mt="md" mb="xs">
          <Badge size='lg' fw={800}>{date}</Badge>
          <Badge size='lg' color="teal">{score}</Badge>
        </Group>
      </Card>
    </Link>
  );

}

export default Scorecard