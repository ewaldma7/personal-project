"use client";

import { Status } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

function Leaderboard() {
  interface User {
    user_id: number;
    name: string;
    email: string;
    location: string | null;
    role: string | null;
  }

  interface Friend {
    created_at: Date;
    friend: User;
    user_id: number;
    friend_id: number;
    user_requested: Boolean;
    status: Status;
  }

  const currDate = new Date().toLocaleDateString();
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/friends?user_id=${session.user.user_id}&status=ACCEPTED`
          );
          setFriends(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [session]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Leaderboard header */}
        <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Leaderboard: {currDate}
          </h2>
          <p className="text-sm text-gray-600">Score</p>
        </div>

        {/* Individual leaderboard entries */}
        <div className="flex flex-col">
          {friends.map((friend, index) => (
            <div
              key={friend.friend_id}
              className="flex items-center justify-between px-6 py-4 bg-gray-100"
            >
              <div className="text-gray-600 font-semibold">{index + 1}.</div>
              <div className="pl-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {friend.friend.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {friend.friend.location || "N/A"}
                </p>
              </div>
              <div className="flex-grow" />
              <p className="text-lg font-semibold text-gray-800">3500</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/dashboard">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Leaderboard;
