'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLoginButton from '@/components/SocialLoginButton';
import Separator from '@/components/Separator';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(formData);
      authService.setCurrentUser(user);
      router.push('/chat');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setErrors({ password: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken?: string) => {
    if (!idToken) {
      setErrors({ email: 'Google authentication failed. Please try again.' });
      return;
    }

    setLoading(true);
    try {
      const user = await authService.googleAuth({ idToken });
      authService.setCurrentUser(user);
      router.push('/chat');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      // TODO: Integrate Apple OAuth (if needed)
      console.log('Apple login');
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      <Logo />
      
      <div className="w-full max-w-md rounded-lg p-8 border-[#525252] border">
        <h2 className="text-lg leading-[100%] font-[800 ] text-white text-center mb-6">
          Login to TuringTech Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Separator />

        <div className="space-y-3">
          <SocialLoginButton provider="google" onClick={handleGoogleLogin}>
            Continue with Google
          </SocialLoginButton>
          
          <SocialLoginButton provider="apple" onClick={handleAppleLogin}>
            Continue with Apple
          </SocialLoginButton>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Or{' '}
          <Link href="/register" className="text-orange-500 hover:text-orange-400 underline">
            click here to sign up and get started
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
