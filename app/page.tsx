'use client'
import { Avatar } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();
  return (
    <>
    <h1>HomePage</h1>
    </>
  )
}
