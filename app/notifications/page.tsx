"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Status } from "@prisma/client";
import { Text, Title, SegmentedControl } from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../components/LoadingSpinner";

function Notifications() {
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

  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("r");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const friendsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/friends/?user_id=${
              session?.user.user_id
            }/&status=${"PENDING"}`
          );
          setFriends(friendsResponse.data);
          const user = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user.user_id}`
          );
          setUser(user.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (value === "r") {
      //received
      setFilteredFriends(friends.filter((friend) => !friend.user_requested));
    } else if (value === "s") {
      //sent
      setFilteredFriends(friends.filter((friend) => friend.user_requested));
    }
  }, [value, friends, session]);

  const answerRequest = async (
    friend_id: number,
    friend_name: string,
    accepted: boolean
  ) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/friends`,
        { user_id: session?.user.user_id, friend_id, accepted }
      );
      setFriends(friends.filter((friend) => friend.friend_id !== friend_id));
      notifications.show({
        title: `${accepted ? "Accepted" : "Declined"}`,
        message: `${friend_name}'s request has been ${
          accepted ? "accepted!" : "declined."
        }`,
        color: `${accepted ? "teal" : "red"}`,
        icon: <IconCheck />,
      });
    } catch (error) {
      console.log(error);
    }
  };

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

  const renderFriendCard = (friend: User) => (
    <div
      key={friend?.user_id}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between"
    >
      <div className="flex items-center">
        {renderAvatar(friend.name)}
        <div className="ml-4">
          <Link href={`/profile/${friend.user_id}`}>
            <h3 className="text-lg font-semibold">{friend.name}</h3>
          </Link>
          <p className="text-gray-500">{friend.email}</p>
        </div>
      </div>
      {value === "r" && (
        <div className="mt-2 sm:mt-0">
          <button
            onClick={() => answerRequest(friend.user_id, friend.name, true)}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => answerRequest(friend.user_id, friend.name, false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="mx-4 sm:mx-10 lg:mx-20">
      <div className="flex flex-wrap items-center">
        <IconBell className="text-[#A16207] w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
        <Title className="text-[#A16207]" size="lg">
          Friend Requests
        </Title>
        <SegmentedControl
          className="ml-auto mt-2 sm:mt-0 w-full sm:w-auto"
          color="#A16207"
          value={value}
          onChange={setValue}
          data={[
            { label: "Received", value: "r" },
            { label: "Sent", value: "s" },
          ]}
        />
      </div>
      <div className="mt-5">
        {filteredFriends.length !== 0 ? (
          filteredFriends.map((friend) => renderFriendCard(friend.friend))
        ) : (
          <Text size="xl" fw="300">
            No current requests!
          </Text>
        )}
      </div>
    </div>
  );
}

export default Notifications;
