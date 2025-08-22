import { AuthSession } from "@/authUtils.ts";
import {
  Context,
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  initialAuthSession: AuthSession | null;
};

type AuthContextValue = {
  refreshPopup: string | null;
  session: AuthSession | null;
  removeRefreshPopup: () => void;
};

export const AuthContext: Context<AuthContextValue> = createContext({
  refreshPopup: null,
  session: {},
} as AuthContextValue);

export default function AuthProvider({
  initialAuthSession,
  children,
}: PropsWithChildren<Props>) {
  const [refreshPopup, setRefreshPopup] = useState<string | null>(null);
  const [session, setSession] = useState<AuthSession | null>(
    initialAuthSession,
  );

  const removeRefreshPopup = () => {
    setRefreshPopup("");
  };

  // console.log(initialAuthSession);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/auth/refresh")
        .then((r) => {
          if (!r.ok) {
            setRefreshPopup(
              "Could not refresh token. You may need to sign out and sign in again.",
            );
            return "Could not refresh token";
          }
          return r.json();
        })
        .then((j) => {
          setSession(j);
        });
    }, 600e3);

    return () => {
      clearInterval(interval);
    };
  });

  const props = useMemo(() => {
    return { refreshPopup, session, removeRefreshPopup };
  }, [refreshPopup, session]);

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
}
