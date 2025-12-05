import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const RECAPTCHA_SCRIPT_URL = "https://www.google.com/recaptcha/api.js";

export interface RecaptchaRef {
  execute: () => Promise<string | null>;
  reset: () => void;
}

interface RecaptchaProps {
  onVerify?: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  size?: "normal" | "compact" | "invisible";
  theme?: "light" | "dark";
}

const Recaptcha = forwardRef<RecaptchaRef, RecaptchaProps>(
  (
    {
      onVerify,
      onExpired,
      onError,
      size = "normal",
      theme = "light",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const scriptLoadedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      execute: async (): Promise<string | null> => {
        if (widgetIdRef.current === null) {
          console.error("reCAPTCHA widget not initialized");
          return null;
        }

        try {
          if (size === "invisible") {
            window.grecaptcha.execute(widgetIdRef.current);
            return new Promise((resolve) => {
              const originalCallback = window.__recaptchaCallback;
              window.__recaptchaCallback = (token: string) => {
                resolve(token);
                if (originalCallback) originalCallback(token);
              };
            });
          } else {
            const token = window.grecaptcha.getResponse(widgetIdRef.current);
            return token || null;
          }
        } catch (err) {
          console.error("reCAPTCHA execution error:", err);
          return null;
        }
      },
      reset: () => {
        if (widgetIdRef.current !== null) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (err) {
            console.error("reCAPTCHA reset error:", err);
          }
        }
      },
    }));

    useEffect(() => {
      if (!RECAPTCHA_SITE_KEY) {
        console.error(
          "reCAPTCHA Site Key not found. Please set VITE_RECAPTCHA_SITE_KEY in your environment variables."
        );
        return;
      }

      const loadRecaptchaScript = () => {
        if (scriptLoadedRef.current || window.grecaptcha) {
          initializeRecaptcha();
          return;
        }

        const script = document.createElement("script");
        script.src = RECAPTCHA_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoadedRef.current = true;
          initializeRecaptcha();
        };
        document.head.appendChild(script);
      };

      const initializeRecaptcha = () => {
        if (!window.grecaptcha || !window.grecaptcha.render) {
          setTimeout(initializeRecaptcha, 100);
          return;
        }

        if (!containerRef.current || widgetIdRef.current !== null) {
          return;
        }

        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            size: size,
            theme: theme,
            callback: (token: string) => {
              if (onVerify) onVerify(token);
              window.__recaptchaCallback?.(token);
            },
            "expired-callback": () => {
              if (onExpired) onExpired();
            },
            "error-callback": () => {
              if (onError) onError();
            },
          });
        } catch (err) {
          console.error("reCAPTCHA initialization error:", err);
        }
      };

      loadRecaptchaScript();

      return () => {
        if (widgetIdRef.current !== null) {
          try {
            window.grecaptcha?.reset(widgetIdRef.current);
          } catch (err) {
            console.error("reCAPTCHA cleanup error:", err);
          }
          widgetIdRef.current = null;
        }
      };
    }, [onVerify, onExpired, onError, size, theme]);

    if (!RECAPTCHA_SITE_KEY) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ reCAPTCHA configuration missing. Please set VITE_RECAPTCHA_SITE_KEY.
          </p>
        </div>
      );
    }

    return <div ref={containerRef} className="flex justify-center" />;
  }
);

Recaptcha.displayName = "Recaptcha";

export default Recaptcha;

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          size?: string;
          theme?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
      execute: (widgetId: number) => void;
    };
    __recaptchaCallback?: (token: string) => void;
  }
}
