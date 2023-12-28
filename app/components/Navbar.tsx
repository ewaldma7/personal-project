'use client'

import Link from 'next/link'
import React from 'react'
import { GiBaseballGlove } from "react-icons/gi";
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import LoginButton from './LoginButton';

const Navbar = () => {

  const currentPath = usePathname();
  const links = [
    {label: 'Dashboard', href: "/dashboard"},
    {label: 'Register', href: "/register"},
    {label: 'Login', href: "/login"},
  ]

  return (
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