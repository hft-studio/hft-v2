"use client"
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const SignInButton = () => {

  const handleSignInWithCoinbase = async () => {
    await signIn('coinbase', { callbackUrl: '/explore' });
  };
  return (
      <Button size='lg' className='font-medium px-8 py-6 w-full rounded-xl' variant={'secondary'} onClick={handleSignInWithCoinbase} >Connect with Coinbase</Button>
  );
}