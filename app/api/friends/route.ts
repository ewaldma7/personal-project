import prisma from "@/app/lib/client";
import { requestFriendSchema, respondFriendSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";

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
        const user_id = params.get('user_id')
        if (!user_id)  return NextResponse.json('No User ID provided!', { status: 400 });
        const friends = await prisma.friend.findMany({
            where: {
                user_id: parseInt(user_id),
                status: "ACCEPTED"
            },
            include: {
                friend: true
            }
        });
        return NextResponse.json(friends, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving friends', { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = requestFriendSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const existingRequest = await prisma.friend.findUnique({
            where: {
                user_id_friend_id: {
                  user_id: body.user_id,
                  friend_id: body.friend_id
                }
              }
        });
        if (existingRequest) {
            return NextResponse.json('You have already requested to be friends with this user', { status: 400 });
        }
        const newRequest = await prisma.friend.create({ data: { user_id: body.user_id, friend_id: body.friend_id } });
        const newRequest2 = await prisma.friend.create({ data: { user_id: body.friend_id, friend_id: body.user_id } });
        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating friend request', { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = respondFriendSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const existingRequest = await prisma.friend.findUnique({
            where: {
                user_id_friend_id: {
                  user_id: body.user_id,
                  friend_id: body.friend_id
                }
              }
        });
        if (!existingRequest) {
            return NextResponse.json('There is no pending request', { status: 400 });
        }
        const newRequest = await prisma.friend.update({ data: {status: body.status}, where: { user_id_friend_id: {
            user_id: body.user_id,
            friend_id: body.friend_id
          } } });
        const newRequest2 = await prisma.friend.update({ data: {status: body.status}, where: { user_id_friend_id: {
        user_id: body.friend_id,
        friend_id: body.user_id
        } } });
        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error updating friend request', { status: 500 });
    }
}