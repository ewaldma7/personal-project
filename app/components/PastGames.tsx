"use client";

import React, { useState } from "react";
import Scorecard from "./Scorecard";
import { Text, Group, Pagination, Container } from "@mantine/core";
import { Guess, Result } from "@prisma/client";

interface ExtendedResult extends Result {
  guesses: Guess[];
}

interface Props {
  results: ExtendedResult[];
  previousDates: string[];
}

const PastGames: React.FC<Props> = ({ results, previousDates }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(previousDates.length / itemsPerPage);

  const displayedDates = previousDates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container size="100%" className="max-w-7xl">
      <div className=" mb-5">
        <Text size="xl" fw="800">
          Past Games
        </Text>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {displayedDates.map((date) => {
          const result = results.find((r) => r.date === date);
          return (
            <div key={date} className="flex justify-center">
              <Scorecard result={result} date={date} />
            </div>
          );
        })}
      </div>
      <Group justify="center" mt="xl">
        <Pagination
          value={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
          color="teal"
        />
      </Group>
    </Container>
  );
};

export default PastGames;
