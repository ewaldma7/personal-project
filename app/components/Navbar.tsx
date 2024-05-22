'use client'

import Link from 'next/link'
import React from 'react'
import classNames from 'classnames'
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileMenu from './ProfileMenu';

const Navbar = () => {

  const currentPath = usePathname();
  const { data: session } = useSession();
  const noNavPaths = ["/", "/login", "/register"]
  const links = [
    {label: 'Dashboard', href: "/dashboard"},
    {label: 'Profile', href: `/profile/${session?.user.user_id}`},
    {label: 'Notifications', href: `/notifications/${session?.user.user_id}`},
    {label: 'Leaderboard', href: "/leaderboard"},
  ]
  const pathname = usePathname();
  const showNavbar = !noNavPaths.includes(pathname); // Check if current path is not root  

  return (
    session && showNavbar &&
    <nav className='flex space-x-6 border-b mb-5 px-5 py-5 h-20 items-center'>
        <ProfileMenu name={session.user.name}/>
        <ul className='flex space-x-6'>
            {links.map(link => <Link key={link.href} href={link.href} 
            className={classNames({
                'text-zinc-900': link.href === currentPath,
                'text-zinc-500': link.href !== currentPath,
                'hover:text-zinc-800 transition-colors': true
            })}>{link.label}</Link>)}
        </ul>
    </nav>
  )
}

export default Navbar