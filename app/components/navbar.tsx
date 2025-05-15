"use client"
import React from 'react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { CircleUserIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';

export const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div>
            <nav className="border-b-0 bg-black/40 h-[60px] backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="relative flex items-center justify-center">
                                    <Image
                                        src="/2.png"
                                        alt="HF Studio Logo"
                                        width={36}
                                        height={20}
                                        className="drop-shadow-[0_0_8px_rgba(90,161,227,0.6)]"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex items-center space-x-5 mr-2">
                                <a
                                    href="/feedback"
                                    className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
                                >
                                    Feedback
                                </a>
                                <a
                                    href="/help"
                                    className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
                                >
                                    Help
                                </a>
                                <a
                                    href="/docs"
                                    className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
                                >
                                    Docs
                                </a>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <CircleUserIcon className="h-5 w-5" />
                                        <span className="sr-only">Toggle user menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 h-12">
                        <a href="/explore" className="text-[#5AA1E3] px-3 py-2 text-sm font-medium border-b-2 border-[#5AA1E3]">Explore</a>
                        <a href="/positions" className="text-gray-300 hover:text-[#5AA1E3] px-3 py-2 text-sm font-medium">Positions</a>
                    </div>
                </div>
            </div>
        </div>
    );
};