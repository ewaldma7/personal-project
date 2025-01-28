"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiMail, FiMapPin, FiUsers, FiCalendar, FiStar } from "react-icons/fi";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../../components/LoadingSpinner";

function UserProfile({ params }: { params: { userId: string } }) {
  interface User {
    user_id: number;
    name: string;
    email: string;
    location: string | null;
    role: number;
  }

  interface Result {
    result_id: number;
    user_id: number;
    game_id: number;
    answers: string[];
    score: number;
    guesses: Guess[];
    date: string;
  }

  interface Guess {
    id: number;
    question_id: number;
    result_id: number;
    user_id: number;
    category: string;
    guess: string;
    isCorrect: boolean;
  }

  type CategoryObject = { category: string; percentage: number };

  const CATEGORIES = useMemo(
    () => ["ART", "ENTERTAINMENT", "GEOGRAPHY", "HISTORY", "SCIENCE", "SPORTS"],
    []
  );
  const CATEGORY_COLOR_MAP = new Map<string, string>([
    ["ENTERTAINMENT", "text-pink-600"],
    ["SPORTS", "text-orange-600"],
    ["ART", "text-red-600"],
    ["SCIENCE", "text-green-600"],
    ["GEOGRAPHY", "text-blue-600"],
    ["HISTORY", "text-yellow-600"],
  ]);
  const [results, setResults] = useState<Result[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [catMap, setCatMap] = useState<CategoryObject[]>([]);
  const [friends, setFriends] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/friends/?user_id=${
            params.userId as string
          }/&status=${"ACCEPTED"}`
        );
        setFriends(friendsResponse.data);
        const user = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${params.userId}`
        );
        const resultsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/results/${params.userId}/*`
        );
        setResults(resultsResponse.data);
        setUser(user.data);
        const allGuesses: Guess[] = resultsResponse.data.reduce(
          (combinedGuesses: Guess[], result: Result) => {
            return combinedGuesses.concat(result.guesses);
          },
          []
        );
        setGuesses(allGuesses);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params.userId]);

  useEffect(() => {
    function getAvgScore() {
      if (results.length === 0) {
        return 0;
      }
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const averageScore = totalScore / results.length;
      return averageScore;
    }

    const fetchData = async () => {
      try {
        if (results.length !== 0) {
          const avgScore = getAvgScore();
          setAvgScore(avgScore);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [results]);

  useEffect(() => {
    const categoryPercentages = Array.from(
      guesses.reduce((stats, guess) => {
        const { category, isCorrect } = guess;
        stats.get(category)!.total += 1;
        stats.get(category)!.correct += isCorrect ? 1 : 0;
        return stats;
      }, new Map<string, { total: number; correct: number }>(CATEGORIES.map((category) => [category, { total: 0, correct: 0 }])))
    ).map(([category, { total, correct }]) => ({
      category,
      percentage: total === 0 ? NaN : (correct / total) * 100,
    }));
    setCatMap(categoryPercentages);
  }, [guesses, CATEGORIES]);

  const renderAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700">
        {initials}
      </div>
    );
  };

  const renderFriendCard = (friend: any) => (
    <Link key={friend.user_id} href={`/profile/${friend.user_id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
        {renderAvatar(friend.name)}
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{friend.name}</h3>
          <p className="text-gray-500">{friend.location}</p>
        </div>
      </div>
    </Link>
  );

  const sendFriendRequest = async () => {
    if (requestEmail.toLowerCase() === user?.email.toLowerCase()) {
      setError("Cannot send friend request to yourself.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends`,
        { user_id: user?.user_id, email: requestEmail }
      );
      notifications.show({
        onClose: () => setError(""),
        title: "Success!",
        message: `Friend request sent to ${response.data.friend.email}`,
        color: "teal",
        icon: <IconCheck />,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data);
        return;
      }
    }

    close();
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <div className="container mx-auto mt-8 flex flex-col lg:flex-row gap-8">
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="flex flex-col">
            <div className="mb-4 flex items-center">
              <h2 className="text-2xl font-semibold mb-2 mr-2">{user?.name}</h2>
            </div>
            <p className="text-gray-600 flex items-center">
              <FiMail className="mr-2" /> {user?.email}
            </p>
            <p className="text-gray-600 flex items-center">
              <FiMapPin className="mr-2" /> {user?.location}
            </p>
            <div className="flex items-center my-4">
              <FiCalendar className="text-4xl mr-4 text-blue-500" />
              <div>
                <p className="text-xl font-semibold">Days Played</p>
                <p className="text-gray-600 text-4xl">{results.length}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiStar className="text-4xl mr-4 text-yellow-500" />
              <div>
                <p className="text-xl font-semibold">Average Score</p>
                <p className="text-gray-600 text-4xl">{avgScore.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-8">Category Percentages</h2>
          <div className="grid grid-cols-3 gap-4">
            {catMap.map((categoryObj) => (
              <div key={categoryObj.category} className="mb-4 text-center">
                <span
                  className={`block 2xl:text-xl xl:text-lg lg:text-sm md:text-xl ${CATEGORY_COLOR_MAP.get(
                    categoryObj.category
                  )} font-semibold mb-2`}
                >
                  {categoryObj.category}
                </span>
                <span
                  className={`block text-4xl ${CATEGORY_COLOR_MAP.get(
                    categoryObj.category
                  )} font-bold`}
                >
                  {!Number.isNaN(categoryObj.percentage)
                    ? `${categoryObj.percentage.toFixed(0)}%`
                    : "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Friends</h2>
          <div className="text-gray-600 max-h-72 overflow-y-auto">
            {friends.map((friend: any) => renderFriendCard(friend.friend))}
          </div>

          <Modal
            centered
            opened={opened}
            onClose={close}
            title="Send Friend Request"
          >
            <TextInput
              type="email"
              label="Enter email:"
              placeholder="johndoe123@gmail.com"
              onChange={(e) => setRequestEmail(e.target.value)}
            />
            <div className="text-red-500 mt-2">
              {error && <Text>{error}</Text>}
            </div>
            <button
              disabled={requestEmail === ""}
              onClick={sendFriendRequest}
              className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 mt-4 text-sm rounded"
            >
              Send
            </button>
          </Modal>
          {session?.user.user_id === parseInt(params.userId) && (
            <button
              onClick={open}
              className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 mt-4 rounded"
            >
              <FiUsers className="mr-2" style={{ display: "inline" }} /> Add
              Friends
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;
