'use client'

import { Avatar, Card, Grid, Heading, Link, Strong, Text, Theme } from '@radix-ui/themes'
import React from 'react'

interface ScorecardProps {
    score: String;
    date: String;
}

const Scorecard: React.FC<ScorecardProps> = ({score, date}) => {
    return (
        <Link href={`/results/${date.replace(/\//g, '-')}`}>
        <Card style={{border: `solid 2px RGB(156,130,117)`, backgroundColor: '#d1d5db'}} size="3" className='rounded-full mt-10 bg-gray-300 cursor-pointer '>
            <Grid rows="2" gap="2" display="inline-grid" flow="column">
            <Avatar variant="solid"  radius="full" fallback={score} style={{margin: 'auto'}} />
            <Text size="3"><Strong>{date}</Strong></Text>
            </Grid>
        </Card>
        </Link>
    )
}

export default Scorecard