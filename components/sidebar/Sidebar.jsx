'use client';
import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const user = useUser();



    return (
        <>
            {/* Hamburger Menu for Mobile */}
            {!isSidebarOpen && ( // Only show hamburger button when sidebar is closed
                <div className="lg:hidden fixed top-4 right-4 z-50">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-black  rounded-lg focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
            )}

            {/* Sidebar for Desktop and Mobile */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:transform-none lg:min-h-screen`}
            >
                {/* Close Button for Mobile Sidebar */}
                {isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden absolute top-4 right-4 p-2 text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                )}

                {/* Logo or Brand Name */}
                <div className="text-2xl font-bold mb-8">
                    <Link href="/admin">Admin Panel</Link>

                </div>


                {/* Navigation Links */}
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <div className='flex gap-5 items-center'>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                                <p>{user?.user?.firstName} {user?.user?.lastName}</p>
                            </div>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="block p-2 hover:bg-gray-700 rounded transition duration-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin"
                                className="block p-2 hover:bg-gray-700 rounded transition duration-200"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/rooms"
                                className="block p-2 hover:bg-gray-700 rounded transition duration-200"
                            >
                                Rooms
                            </Link>
                        </li>
                      

                        <li>
                            <Link
                                href="/admin/bookings"
                                className="block p-2 hover:bg-gray-700 rounded transition duration-200"
                            >
                                Bookings
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout Button */}
                <SignedIn>
                    <div className="mt-8">
                        <button
                            onClick={() => {
                                // Handle logout logic here
                                console.log('Logged out');
                            }}
                            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded transition duration-200"
                        >
                            <SignOutButton />
                        </button>
                    </div>
                </SignedIn>
            </div>
        </>
    );
};

export default Sidebar;