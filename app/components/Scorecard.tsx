'use client'

import { Avatar, Card, Grid, Heading, Link, Strong, Text } from '@radix-ui/themes'
import React from 'react'

interface ScorecardProps {
    score: string;
    date: string;
}

const Scorecard: React.FC<ScorecardProps> = ({score, date}) => {
    return (
        <Link href={`/results/${date.replace(/\//g, '-')}`}>
        <Card style={{backgroundColor: 'rgb(209 213 219)', border: 'solid 2px rgb(72, 160, 195)'}} size="3" className='rounded-full mt-10 bg-gray-300 cursor-pointer '>
            <Grid rows="2" gap="2" display="inline-grid" flow="column">
            <Avatar variant="solid" color="cyan"  radius="full" fallback={score} style={{margin: 'auto'}} />
            <Text size="3"><Strong>{date}</Strong></Text>
            </Grid>
        </Card>
        </Link>
    )
}

export default Scorecard