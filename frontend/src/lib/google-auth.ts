// Utility helpers for interacting with Google Identity Services and OAuth flows

// Minimal type augmentation for the Google Identity Services script
export interface GoogleCredentialResponse {
  credential?: string | null;
  clientId?: string;
  select_by?: string;
}

interface GoogleInitializationOptions {
  clientId: string;
  callback: (response: GoogleCredentialResponse) => void | Promise<void>;
  autoSelect?: boolean;
  uxMode?: "popup" | "redirect";
}

export type GoogleUserType = "student" | "institution";
export type requestedType = "register" | "login";

export interface GoogleOAuthRedirectParams {
  clientId: string;
  redirectUri?: string;
  frontendRedirectUri?: string;
  scope?: string;
  responseType?: string;
  accessType?: "online" | "offline";
  prompt?: string;
  includeGrantedScopes?: boolean;
  state?: string;
  userType?: GoogleUserType;
  type?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void | Promise<void>;
            auto_select?: boolean;
            ux_mode?: "popup" | "redirect";
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let googleScriptPromise: Promise<boolean> | null = null;

/**
 * Dynamically loads the Google Identity Services script if it hasn't been loaded already.
 */
export function loadGoogleIdentityScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(true);
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      if (window.google?.accounts?.id) {
        resolve(true);
        return;
      }

      existingScript.addEventListener(
        "load",
        () => resolve(!!window.google?.accounts?.id),
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => {
          googleScriptPromise = null;
          resolve(false);
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(!!window.google?.accounts?.id);
    script.onerror = () => {
      googleScriptPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

/**
 * Initializes Google Identity Services with the provided client ID and callback.
 * Must be called after the script has successfully loaded.
 */
export function initializeGoogleIdentity(options: GoogleInitializationOptions) {
  if (typeof window === "undefined") {
    throw new Error("Google Identity Services is unavailable on the server");
  }

  const accountsId = window.google?.accounts?.id;
  if (!accountsId) {
    throw new Error("Google Identity Services script is not loaded");
  }

  accountsId.initialize({
    client_id: options.clientId,
    callback: options.callback,
    auto_select: options.autoSelect ?? false,
    ux_mode: options.uxMode ?? "popup",
  });
}

/**
 * Prompts the Google One Tap / OAuth popup. Assumes initialization has completed.
 */
export function promptGoogleSignIn() {
  if (typeof window === "undefined" || !window.google?.accounts?.id) {
    throw new Error("Google Identity Services is not ready");
  }

  window.google.accounts.id.prompt();
}

/**
 * Builds a classic OAuth authorization URL for redirect-based flows.
 */
export function buildGoogleOAuthUrl(params: GoogleOAuthRedirectParams): string {
  const redirectUri = params.redirectUri ?? params.frontendRedirectUri;

  if (!redirectUri) {
    throw new Error("Google OAuth redirect URI is not configured");
  }

  const searchParams = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: redirectUri,
    response_type: params.responseType ?? "code",
    scope: params.scope ?? "openid email profile",
    access_type: params.accessType ?? "offline",
    prompt: params.prompt ?? "consent",
  });

  if (params.includeGrantedScopes) {
    searchParams.set("include_granted_scopes", "true");
  }

  if (params.state) {
    searchParams.set("state", params.state);
  }

  if (params.userType) {
    searchParams.set("userType", params.userType);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.frontendRedirectUri) {
    searchParams.set("frontend_redirect_uri", params.frontendRedirectUri);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;
}

/**
 * Redirects the browser to Google's OAuth consent screen. Returns the URL for convenience/testing.
 */
export function redirectToGoogleOAuth(params: GoogleOAuthRedirectParams): string {
  const url = buildGoogleOAuthUrl(params);

  if (typeof window !== "undefined") {
    if (params.frontendRedirectUri) {
      // Stay within the frontend by delegating the OAuth start to our own route
      const query = new URLSearchParams({ target: params.frontendRedirectUri });

      if (params.state) {
        query.set("state", params.state);
      }

      window.location.href = `${params.frontendRedirectUri}?${query.toString()}`;
    } else {
      window.location.href = url;
    }
  }

  return url;
}