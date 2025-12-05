const API_URL = import.meta.env.VITE_API_URL;

export type SendRecoveryEmailResponse = {
  message: string;
};

export type ValidateTokenResponse = {
  isValid: boolean;
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export class PasswordRecoveryError extends Error {
  public statusCode: number;
  public rateLimitRetryAfter?: number;

  constructor(message: string, statusCode: number, retryAfter?: number) {
    super(message);
    this.name = "PasswordRecoveryError";
    this.statusCode = statusCode;
    this.rateLimitRetryAfter = retryAfter;
  }
}

export async function sendRecoveryEmail(
  email: string,
  captchaToken?: string
): Promise<SendRecoveryEmailResponse> {
  let url = `${API_URL}/password-recovery/${encodeURIComponent(email)}`;
  
  if (captchaToken) {
    url += `?captchaToken=${encodeURIComponent(captchaToken)}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to send recovery email";
    let retryAfter: number | undefined;

    if (res.status === 429) {
      const retryAfterHeader = res.headers.get("Retry-After");
      if (retryAfterHeader) {
        retryAfter = parseInt(retryAfterHeader, 10);
      }
      errorMessage = "Too many requests. Please try again later.";
    } else if (res.status === 400) {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || errorMessage;
      } catch {
        errorMessage = "Invalid request. Please check your email address.";
      }
    } else if (res.status === 500) {
      errorMessage = "Something went wrong. Please try again later.";
    } else {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || errorMessage;
      } catch {
        // Use default error message
      }
    }

    throw new PasswordRecoveryError(errorMessage, res.status, retryAfter);
  }

  return await res.json();
}

export async function validateResetToken(
  token: string
): Promise<ValidateTokenResponse> {
  const res = await fetch(`${API_URL}/reset-password/${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to validate reset token";

    if (res.status === 400 || res.status === 404) {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || "This reset link is invalid or has expired.";
      } catch {
        errorMessage = "This reset link is invalid or has expired.";
      }
    } else if (res.status === 500) {
      errorMessage = "Something went wrong. Please try again later.";
    } else {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || errorMessage;
      } catch {
        // Use default error message
      }
    }

    throw new PasswordRecoveryError(errorMessage, res.status);
  }

  return await res.json();
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to reset password";

    if (res.status === 400) {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || "Invalid or expired reset token.";
      } catch {
        errorMessage = "Invalid or expired reset token.";
      }
    } else if (res.status === 500) {
      errorMessage = "Something went wrong. Please try again later.";
    } else {
      try {
        const data = await res.json();
        errorMessage = data.message || data.detail || errorMessage;
      } catch {
        // Use default error message
      }
    }

    throw new PasswordRecoveryError(errorMessage, res.status);
  }

  return await res.json();
}
