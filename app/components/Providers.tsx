'use client'

import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode;
}

const Providers = ({children}: Props) => {
  return (
    <SessionProvider><MantineProvider>{children}</MantineProvider></SessionProvider>
  )
}

export default Providers