# Daily Trivia Challenge

A full-stack web application that offers daily trivia challenges across multiple categories. Players can compete with friends, track their progress, and compare scores on the leaderboard.

## Features

- **Daily Challenges**: New set of curated trivia questions every day
- **Multiple Categories**: Questions from various categories including History, Geography, Science, Sports, Art, and Entertainment
- **Social Features**: Add friends and compete on the leaderboard
- **Progress Tracking**: View detailed statistics and past performance

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Mantine UI
- TailwindCSS
- NextAuth.js for authentication

### Backend
- PostgreSQL with Prisma ORM
- OpenAI API for question generation
- Vercel for hosting and serverless functions

## Key Technical Features

- Server-side rendering with Next.js App Router
- Automated daily question generation using OpenAI API
- JWT-based authentication system
- Real-time notifications for friend requests
- Automated database migrations with Prisma
- Scheduled tasks using Vercel Cron Jobs

## Project Structure

- `/app`: Next.js application routes and API endpoints
- `/components`: Reusable React components
- `/prisma`: Database schema and migrations
- `/lib`: Utility functions and shared logic
- `/public`: Static assets

## License

MIT License

Copyright (c) 2024 Ethan Waldman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
