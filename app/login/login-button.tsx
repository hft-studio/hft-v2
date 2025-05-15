"use client"
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const LoginButton = () => {

  const handleSignInWithCoinbase = async () => {
    await signIn('coinbase');
  };

  return (
      <Button className='mx-auto w-64 rounded-full' onClick={handleSignInWithCoinbase} >Connect with Coinbase</Button>
  );
}