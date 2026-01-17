'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLoginButton from '@/components/SocialLoginButton';
import Separator from '@/components/Separator';
import Checkbox from '@/components/Checkbox';
import { authService } from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    acceptTerms?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      acceptTerms?: string;
    } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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
      const user = await authService.register({
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email,
        password: formData.password,
      });
      authService.setCurrentUser(user);
      router.push('/chat');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (idToken?: string) => {
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
      const errorMessage = error instanceof Error ? error.message : 'Google signup failed';
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    try {
      // TODO: Integrate Apple OAuth (if needed)
      console.log('Apple signup');
    } catch (error) {
      console.error('Apple signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      <Logo />
      
      <div className="w-full max-w-md rounded-lg p-8 border-[#525252] border">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Unlock your edge with TuringTech Test
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

          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            error={errors.acceptTerms}
            label={
              <>
                I accept the{' '}
                <Link href="/terms" className="text-orange-400 hover:text-orange-300 underline">
                  terms and conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                  privacy policy
                </Link>
              </>
            }
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <Separator />

        <div className="space-y-3">
          <SocialLoginButton provider="google" onClick={handleGoogleSignup}>
            Sign up with Google
          </SocialLoginButton>
          
          <SocialLoginButton provider="apple" onClick={handleAppleSignup}>
            Sign up with Apple
          </SocialLoginButton>
        </div>
      </div>
    </div>
  );
}
