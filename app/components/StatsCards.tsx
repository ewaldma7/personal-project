import { Text, Paper, Group } from "@mantine/core";
import {
  IconTrophy,
  IconChartBar,
  IconFlame,
} from "@tabler/icons-react";

interface StatsCardProps {
  results: any[];
  streak: number;
  winRate: number;
}

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatsCards = ({ results, streak, winRate }: StatsCardProps) => {
  const stats: StatsCard[] = [
    {
      title: "Games Played",
      value: results.length,
      icon: <IconChartBar size={32} />,
      description: "Total games completed",
    },
    {
      title: "Current Streak",
      value: streak,
      icon: <IconFlame size={32} color="orange" />,
      description: "Consecutive days played",
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      icon: <IconTrophy size={32} color="gold" />,
      description: "Games with 3+ correct answers",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
      {stats.map((stat, index) => (
        <Paper
          key={index}
          shadow="sm"
          radius="md"
          p="xl"
          className="hover:shadow-md transition-shadow"
        >
          <Group>
            {stat.icon}
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.title}
              </Text>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
              <Text size="sm" c="dimmed">
                {stat.description}
              </Text>
            </div>
          </Group>
        </Paper>
      ))}
    </div>
  );
};

export default StatsCards; 