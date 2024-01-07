'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const {data: session} = useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  }

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <button onClick={handleSignOut} className="text-red-600">Sign Out</button>
      </div>
    )
  }
  return <button onClick={() => signIn()} className="text-green-600 ml-auto">Sign In</button>
}
