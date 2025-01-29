"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

function Leaderboard() {
  interface LeaderboardEntry {
    user_id: number;
    name: string;
    location: string | null;
    score: number | null;
  }

  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          // Format today's date without leading zeros
          const today = new Date()
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })
            .split("/")
            .join("-");

          // Fetch friends data
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/friends?user_id=${session.user.user_id}&status=ACCEPTED`
          );

          // Get current user's result
          const userResult = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/results/${session.user.user_id}/*`
          );

          // Create entry for current user
          const currentUserEntry: LeaderboardEntry = {
            user_id: session.user.user_id,
            name: session.user.name,
            location: session.user.location || "N/A",
            score:
              userResult.data[0]?.date === today
                ? userResult.data[0]?.score
                : null,
          };

          // Create entries for friends
          const friendEntries = response.data.map(({ friend }: any) => ({
            user_id: friend.user_id,
            name: friend.name,
            location: friend.location || "N/A",
            score: friend.results[0]?.score,
          }));

          // Combine and sort all entries
          const allEntries = [currentUserEntry, ...friendEntries].sort(
            (a, b) => {
              const scoreA = a.score ?? -1;
              const scoreB = b.score ?? -1;
              return scoreB - scoreA;
            }
          );

          setLeaderboardData(allEntries);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Leaderboard header */}
          <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            <p className="text-lg font-semibold text-gray-600">Score</p>
          </div>

          {/* Individual leaderboard entries */}
          <div className="flex flex-col">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between px-6 py-4 ${
                  entry.user_id === session?.user.user_id
                    ? "bg-blue-50"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-semibold text-gray-600">
                    {index + 1}.
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {entry.name}
                    </h3>
                    <p className="text-sm text-gray-600">{entry.location}</p>
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {entry.score ?? "No score yet"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/dashboard">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
