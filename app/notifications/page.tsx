"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Status } from "@prisma/client";
import { rem, Text, Title } from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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

  const renderFriendCard = (friend: User) => (
    <div
      key={friend.user_id}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between"
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
      <div>
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
    </div>
  );
  return (
    !loading && (
      <div className="mx-20">
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconBell
            color="#A16207"
            style={{ width: rem(28), height: rem(28), marginRight: "0.5rem" }}
          />
          <Title style={{ color: "#A16207" }}>Friend Requests </Title>
        </div>
        <div className="mt-5">
          {friends.map((friend) => renderFriendCard(friend.friend))}
        </div>
      </div>
    )
  );
}

export default Notifications;
