import prisma from "@/app/lib/client";
import {
  requestFriendSchema,
  respondFriendSchema,
} from "@/app/validationSchemas";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type FriendWhereFilterType = {
  user_id: number;
  status: Status;
  user_requested?: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    if (params.size === 0) {
      const allFriends = await prisma.friend.findMany({
        include: {
          user: true,
          friend: true,
        },
      });
      return NextResponse.json(allFriends, { status: 200 });
    }
    const user_id = params.get("user_id");
    const status = params.get("status");
    if (!user_id || !status)
      return NextResponse.json("No User ID provided!", { status: 400 });
    const whereFilter: FriendWhereFilterType = {
      user_id: parseInt(user_id),
      status: status as Status,
    };
    if (status === "PENDING") {
      whereFilter.user_requested = false;
    }
    const friends = await prisma.friend.findMany({
      where: whereFilter,
      include: {
        friend: {
          select: {
            email: true,
            location: true,
            name: true,
            user_id: true,
          },
        },
      },
    });
    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error retrieving friends", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestFriendSchema.safeParse(body);
    console.log(validation.success);
    if (!validation.success) {
      return NextResponse.json("Invalid email address", { status: 400 });
    }
    const requestedFriend = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!requestedFriend) {
      return NextResponse.json("User with this email does not exist", {
        status: 400,
      });
    }
    const existingFriend = await prisma.friend.findUnique({
      where: {
        user_id_friend_id: {
          user_id: body.user_id,
          friend_id: requestedFriend.user_id,
        },
      },
    });
    if (existingFriend) {
      const message =
        existingFriend.status === "ACCEPTED"
          ? "Cannot send request to existing friend"
          : "Cannot send request multiple times";
      return NextResponse.json(message, { status: 400 });
    }
    const newRequest = await prisma.friend.create({
      data: {
        user_id: body.user_id,
        friend_id: requestedFriend.user_id,
        user_requested: true,
      },
      include: {
        friend: {
          select: {
            email: true,
            location: true,
            name: true,
            user_id: true,
          },
        },
      },
    });
    const newRequest2 = await prisma.friend.create({
      data: {
        user_id: requestedFriend.user_id,
        friend_id: body.user_id,
        user_requested: false,
      },
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error creating friend request", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const validation = respondFriendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }
    const existingRequest = await prisma.friend.findUnique({
      where: {
        user_id_friend_id: {
          user_id: body.user_id,
          friend_id: body.friend_id,
        },
      },
    });
    if (!existingRequest) {
      return NextResponse.json("There is no pending request", { status: 400 });
    }
    const newRequest = await prisma.friend.update({
      data: { status: body.accepted ? "ACCEPTED" : "DECLINED" },
      where: {
        user_id_friend_id: {
          user_id: body.user_id,
          friend_id: body.friend_id,
        },
      },
    });
    const newRequest2 = await prisma.friend.update({
      data: { status: body.accepted ? "ACCEPTED" : "DECLINED" },
      where: {
        user_id_friend_id: {
          user_id: body.friend_id,
          friend_id: body.user_id,
        },
      },
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error updating friend request", { status: 500 });
  }
}
