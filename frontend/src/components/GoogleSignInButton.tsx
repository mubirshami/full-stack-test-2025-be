'use client';

import { useEffect, useRef } from 'react';
import { loadGoogleScript, initializeGoogleAuth } from '@/utils/googleAuth';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: (error: Error) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'signin_with',
  theme = 'outline',
  size = 'large',
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID not configured');
      if (onError) {
        onError(new Error('Google Client ID not configured'));
      }
      return;
    }

    const setupGoogleAuth = async () => {
      try {
        await loadGoogleScript();
        
        initializeGoogleAuth(clientId, (idToken) => {
          onSuccess(idToken);
        });

        // Render button
        if (buttonRef.current && window.google?.accounts?.id) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline', // Use outline theme for dark background
            size,
            text,
            // width: '100%',
            // type: 'standard',
          });
        }
      } catch (error) {
        console.error('Error setting up Google Auth:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    setupGoogleAuth();
  }, [onSuccess, onError, text, theme, size]);

  return (
    <div className="w-full flex justify-center">
      <div ref={buttonRef} className="w-full max-w-[300px]"></div>
    </div>
  );
}
