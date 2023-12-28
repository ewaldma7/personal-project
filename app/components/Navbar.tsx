'use client'

import Link from 'next/link'
import React from 'react'
import { GiBaseballGlove } from "react-icons/gi";
import classNames from 'classnames'
import LoginButton from './LoginButton';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Navbar = () => {

  const currentPath = usePathname();
  const noNavPaths = ["/", "/login", "/register"]
  const links = [
    {label: 'Dashboard', href: "/dashboard"},
    {label: 'Leaderboard', href: "/leaderboard"},
  ]
  const pathname = usePathname();
  const { data: session } = useSession();
  const showNavbar = !noNavPaths.includes(pathname); // Check if current path is not root  

  return (
    session && showNavbar &&
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
        <Link href="/"><GiBaseballGlove /></Link>
        <ul className='flex space-x-6'>
            {links.map(link => <Link key={link.href} href={link.href} 
            className={classNames({
                'text-zinc-900': link.href === currentPath,
                'text-zinc-500': link.href !== currentPath,
                'hover:text-zinc-800 transition-colors': true
            })}>{link.label}</Link>)}
        </ul>
        <LoginButton />
    </nav>
  )
}

export default Navbar