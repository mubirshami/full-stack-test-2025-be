'use client';

import React, { useEffect, useRef } from 'react';
import Button from './Button';
import { loadGoogleScript, initializeGoogleAuth, promptGoogleSignIn } from '@/utils/googleAuth';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  onClick?: (idToken?: string) => void;
  children: React.ReactNode;
}

export default function SocialLoginButton({
  provider,
  onClick,
  children,
}: SocialLoginButtonProps) {
  const isInitialized = useRef(false);
  const clientIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Load Google script if provider is Google
    if (provider === 'google' && !isInitialized.current) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (clientId) {
        clientIdRef.current = clientId;
        loadGoogleScript()
          .then(() => {
            isInitialized.current = true;
            // Initialize Google Auth
            initializeGoogleAuth(clientId, (idToken) => {
              if (onClick) {
                onClick(idToken);
              }
            });
          })
          .catch((error) => {
            console.error('Error loading Google script:', error);
          });
      } else {
        console.error('Google Client ID not configured');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const handleClick = () => {
    if (provider === 'google') {
      const clientId = clientIdRef.current || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error('Google Client ID not configured');
        if (onClick) {
          onClick();
        }
        return;
      }

      if (!window.google?.accounts?.id) {
        console.error('Google Identity Services not loaded. Please wait for initialization.');
        if (onClick) {
          onClick();
        }
        return;
      }

      // Re-initialize to ensure callback is set
      initializeGoogleAuth(clientId, (idToken) => {
        if (onClick) {
          onClick(idToken);
        }
      });

      // Use renderButton approach instead of prompt to avoid FedCM issues
      // Create a hidden container for the Google button
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '1px';
      tempDiv.style.height = '1px';
      tempDiv.style.overflow = 'hidden';
      document.body.appendChild(tempDiv);
      
      try {
        // Render Google button in hidden div
        window.google.accounts.id.renderButton(tempDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
        
        // Wait for button to render, then click it programmatically
        const clickButton = () => {
          const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
          if (button) {
            // Use mouse events to trigger the button
            const mouseEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            button.dispatchEvent(mouseEvent);
            
            // Clean up after a delay
            setTimeout(() => {
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
              }
            }, 3000);
            return true;
          }
          return false;
        };

        // Try immediately, then retry after a short delay
        if (!clickButton()) {
          setTimeout(() => {
            if (!clickButton()) {
              // If still not found, clean up
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
              }
              console.error('Failed to find Google button element');
              if (onClick) {
                onClick();
              }
            }
          }, 300);
        }
      } catch (error) {
        console.error('Error rendering Google button:', error);
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
        if (onClick) {
          onClick();
        }
      }
    } else {
      // For Apple or other providers, use the onClick callback
      if (onClick) {
        onClick();
      }
    }
  };
  const getIcon = () => {
    if (provider === 'google') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z"
            fill="#4285F4"
          />
          <path
            d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z"
            fill="#34A853"
          />
          <path
            d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z"
            fill="#FBBC05"
          />
          <path
            d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
            fill="#EA4335"
          />
        </svg>
      );
    } else {
      // Apple icon
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5209 6.13681C14.4141 6.21782 12.5273 7.25653 12.5273 9.56616C12.5273 12.2376 14.9281 13.1827 15 13.2061C14.9889 13.2637 14.6186 14.5005 13.7342 15.7606C12.9456 16.8695 12.122 17.9766 10.8691 17.9766C9.61614 17.9766 9.2937 17.2655 7.84732 17.2655C6.43778 17.2655 5.93662 18 4.79057 18C3.64452 18 2.84486 16.9739 1.92544 15.7138C0.860459 14.234 0 11.9352 0 9.75338C0 6.25383 2.32895 4.39784 4.62105 4.39784C5.83896 4.39784 6.8542 5.17912 7.61884 5.17912C8.34664 5.17912 9.48164 4.35104 10.8672 4.35104C11.3923 4.35104 13.2791 4.39784 14.5209 6.13681ZM10.2094 2.86949C10.7825 2.20522 11.1878 1.28353 11.1878 0.361836C11.1878 0.234023 11.1768 0.10441 11.1528 0C10.2205 0.0342034 9.11129 0.606661 8.44245 1.36454C7.91733 1.94779 7.42722 2.86949 7.42722 3.80378C7.42722 3.94419 7.45117 4.08461 7.46223 4.12961C7.52119 4.14041 7.617 4.15302 7.71281 4.15302C8.54932 4.15302 9.6014 3.60576 10.2094 2.86949Z" fill="white" />
        </svg>

      );
    }
  };

  return (
    <Button
      variant="social"
      onClick={handleClick}
      className="flex items-center justify-center gap-3 bg-[#171717] border-[#525252]"
    >
      {getIcon()}
      {children}
    </Button>
  );
}
