// Google OAuth Utility

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: boolean; isSkippedMoment: boolean; isDismissedMoment: boolean }) => void) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
};

export const initializeGoogleAuth = (
  clientId: string,
  callback: (idToken: string) => void
): void => {
  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services not loaded');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      callback(response.credential);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });
};

export const promptGoogleSignIn = (callback?: (idToken: string) => void): void => {
  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services not loaded');
    return;
  }

  // Use prompt with notification callback to handle errors
  window.google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed || notification.isSkippedMoment || notification.isDismissedMoment) {
      // If One Tap is not available, fall back to popup
      console.log('One Tap not available, using alternative method');
      // We'll handle this in the component
    }
  });
};

// Alternative method using popup flow
export const signInWithGooglePopup = (
  clientId: string,
  callback: (idToken: string) => void
): void => {
  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services not loaded');
    return;
  }

  // Re-initialize with popup-friendly settings
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      callback(response.credential);
    },
  });

  // Try prompt, but if it fails, we'll use a different approach
  try {
    window.google.accounts.id.prompt();
  } catch (error) {
    console.error('Error with prompt, trying alternative:', error);
    // Fallback: create a temporary button and click it programmatically
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    window.google.accounts.id.renderButton(tempDiv, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
    });
    
    // Trigger click after a short delay
    setTimeout(() => {
      const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.click();
      }
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(tempDiv);
      }, 1000);
    }, 100);
  }
};
