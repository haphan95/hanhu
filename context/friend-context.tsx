"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Friend } from "@/lib/friends";

interface FriendContextValue {
  friend: Friend | null;
  setFriend: (f: Friend | null) => void;
  updateFriendLocal: (updated: Friend) => void;
}

const FriendContext = createContext<FriendContextValue | null>(null);

export function FriendProvider({
  initialFriend,
  children,
}: {
  initialFriend: Friend | null;
  children: ReactNode;
}) {
  const [friend, setFriend] = useState<Friend | null>(initialFriend);

  const updateFriendLocal = useCallback((updated: Friend) => {
    setFriend(updated);
  }, []);

  const value = useMemo<FriendContextValue>(
    () => ({ friend, setFriend, updateFriendLocal }),
    [friend, updateFriendLocal]
  );

  return (
    <FriendContext.Provider value={value}>{children}</FriendContext.Provider>
  );
}

export function useFriend(): FriendContextValue | null {
  return useContext(FriendContext);
}
