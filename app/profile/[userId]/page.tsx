'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiUsers, FiCalendar, FiStar } from 'react-icons/fi'; // Import icons



function UserProfile({ params }: { params: { userId: string } }) {

  interface User {
    user_id: Number;
    name: String;
    email: String;
    location: String | null;
    role: Number;
  }

  interface Result {
    result_id: Number;
    user_id: Number;
    game_id: Number;
    answers: String[];
    score: Number;
  }

  const [results, setResults] = useState<Result[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await axios.get(`http://localhost:3000/api/users/${params.userId}`);
        const results = await axios.get(`http://localhost:3000/api/results/${params.userId}/*`);
        setResults(results.data);
        console.log(results.data)
        setUser(user.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  type CategoryStats = {
    [key: string]: number;
  };

  type UserStats = {
    daysPlayed: number;
    averageScore: number;
    categoryStats: CategoryStats;
  };

  const [loading, setLoading] = useState(true);

  const [userStats] = useState<UserStats>({
    daysPlayed: 50,
    averageScore: 75,
    categoryStats: {
      geography: 80, // Assuming these are direct percentages for each category
      history: 70,
      science: 85,
      entertainment: 100,
      art: 25,
      sports: 50
    },
  });

  const [userFriends] = useState([
    { id: 1, name: 'Friend 1', email: 'testing@gmail.com' },
    { id: 2, name: 'Friend 2', email: 'testing@gmail.com' },
    { id: 3, name: 'Friend 3', email: 'testing@gmail.com' },
    { id: 4, name: 'Friend 4', email: 'testing@gmail.com' },
    { id: 5, name: 'Friend 5', email: 'testing@gmail.com' },
  ]);

  const renderAvatar = (name: string) => {
    const initials = name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();

    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700">
        {initials}
      </div>
    );
  };

  const chunkArray = (array: any[], chunkSize: number) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const categories: [string, number][] = Object.entries(userStats.categoryStats);
  const chunkedCategories: [string, number][][] = chunkArray(categories, 3);


  const renderCategoryStats = () => (
    <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {chunkedCategories.map((chunk: [string, number][], index: number) => (
        <div key={index} className="flex flex-col gap-4">
          {chunk.map(([category, percentage]: [string, number]) => (
            <div key={category} className="p-4 bg-gray-100 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
              <div className="bg-blue-400 h-8 rounded-md mb-2">
                <div className="h-full bg-blue-600" style={{ width: `${percentage}%` }}></div>
              </div>
              <p className="text-gray-600">{percentage}% Correct</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderFriendCard = (friend: any) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center" key={friend.id}>
      {renderAvatar(friend.name)}
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{friend.name}</h3>
        <p className="text-gray-500">{friend.email}</p>
      </div>
    </div>
  );

  return (
    !loading &&
    <div className="container mx-auto mt-8 flex flex-col lg:flex-row gap-8">
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex flex-col">
          <div className="mb-4 flex items-center">
            <h2 className="text-2xl font-semibold mb-2 mr-2">{user?.name}</h2>
          </div>
          <p className="text-gray-600 flex items-center"><FiMail className="mr-2" /> {user?.email}</p>
          <p className="text-gray-600 flex items-center"><FiMapPin className="mr-2" /> {user?.location}</p>
          <div className="flex items-center my-4">
            <FiCalendar className="text-4xl mr-4 text-blue-500" />
            <div>
              <p className="text-xl font-semibold">Days Played</p>
              <p className="text-gray-600">{results.length}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiStar className="text-4xl mr-4 text-yellow-500" />
            <div>
              <p className="text-xl font-semibold">Average Score</p>
              <p className="text-gray-600">{userStats.averageScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {renderCategoryStats()}
        </div>
      </div>

      <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        <div className="text-gray-600 max-h-72 overflow-y-auto">
          {userFriends.map((friend) => renderFriendCard(friend))}
        </div>
        <button className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 mt-4 rounded">
          <FiUsers className="mr-2" style={{ display: 'inline' }} /> Add Friends
        </button>
      </div>
    </div>
  );
}

export default UserProfile;