"use client";

import React, { useState } from "react";
import Scorecard from "./Scorecard";
import { Text, Container } from "@mantine/core";
import { Guess, Result } from "@prisma/client";
import { isSameDay } from "../lib/dateUtils";

interface ExtendedResult extends Result {
  guesses: Guess[];
}

interface Props {
  results: ExtendedResult[];
  previousDates: string[];
}

const PastGames: React.FC<Props> = ({ results, previousDates }) => {
  const itemsPerPage =
    window.innerWidth > 768 ? 4 : window.innerWidth > 480 ? 2 : 1;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(previousDates.length / itemsPerPage);

  const displayedDates = previousDates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container size="100%" className="max-w-7xl">
      <div className="mb-5">
        <Text size="xl" fw="800">
          Past Games
        </Text>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {displayedDates.map((date) => {
          const result = results.find((r) => isSameDay(r.date, date));
          return (
            <div key={date} className="flex justify-center">
              <Scorecard result={result} date={date} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold"
        >
          ←
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold"
        >
          →
        </button>
      </div>
    </Container>
  );
};

export default PastGames;
