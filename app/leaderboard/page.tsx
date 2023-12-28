'use client'

import React from 'react';
import Link from 'next/link';

function Leaderboard() {

    const currDate = new Date().toLocaleDateString();
    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Leaderboard header */}
                <div className="bg-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Leaderboard: {currDate}</h2>
                    <p className="text-sm text-gray-600">Score</p>
                </div>

                {/* Individual leaderboard entries */}
                <div className="flex flex-col">
                    {/* First entry */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
                        <div className="text-gray-600 font-semibold">1.</div>
                        <div className="pl-4">
                            <h3 className="text-lg font-semibold text-gray-800">John Doe</h3>
                            <p className="text-sm text-gray-600">New York</p>
                        </div>
                        <div className="flex-grow" />
                        <p className="text-lg font-semibold text-gray-800">3500</p>
                    </div>

                    {/* Second entry */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="text-gray-600 font-semibold">2.</div>
                        <div className="pl-4">
                            <h3 className="text-lg font-semibold text-gray-800">Jane Smith</h3>
                            <p className="text-sm text-gray-600">Los Angeles</p>
                        </div>
                        <div className="flex-grow" />
                        <p className="text-lg font-semibold text-gray-800">2800</p>
                    </div>

                    {/* Third entry */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
                        <div className="text-gray-600 font-semibold">3.</div>
                        <div className="pl-4">
                            <h3 className="text-lg font-semibold text-gray-800">Alice Johnson</h3>
                            <p className="text-sm text-gray-600">Chicago</p>
                        </div>
                        <div className="flex-grow" />
                        <p className="text-lg font-semibold text-gray-800">2200</p>
                    </div>

                    {/* Additional entries */}
                    {/* Add more entries as needed */}
                </div>

                <div className="flex justify-center py-4">
                    <Link href="/results">
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                            Back to Results
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;

