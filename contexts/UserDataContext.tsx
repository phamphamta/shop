"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";

interface UserData {
  ordersCount: number;
  isEmployee: boolean;
  unreadNotifications: number;
  walletBalance: number;
  isLoading: boolean;
}

interface UserDataContextType extends UserData {
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// Bộ nhớ đệm (Cache) để giảm thiểu số lượng gọi API không cần thiết
let cachedData: UserData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 giây

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData>({
    ordersCount: 0,
    isEmployee: false,
    unreadNotifications: 0,
    walletBalance: 0,
    isLoading: false,
  });

  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      if (!user || !isLoaded) return;

      // Sử dụng dữ liệu đã cache nếu chưa hết hạn
      const now = Date.now();
      if (
        !forceRefresh &&
        cachedData &&
        now - cacheTimestamp < CACHE_DURATION
      ) {
        setUserData(cachedData);
        return;
      }

      setUserData((prev) => ({ ...prev, isLoading: true }));

      try {
        // Tải toàn bộ dữ liệu người dùng qua một API call duy nhất đã được tối ưu hóa
        const response = await fetch("/api/user/combined-data", {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();

          const newUserData = {
            ordersCount: data.ordersCount || 0,
            isEmployee: data.isEmployee || false,
            unreadNotifications: data.unreadNotifications || 0,
            walletBalance: data.walletBalance || 0,
            isLoading: false,
          };

          // Cập nhật bộ nhớ đệm
          cachedData = newUserData;
          cacheTimestamp = now;

          setUserData(newUserData);
        } else {
          setUserData((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [user, isLoaded]
  );

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [user, isLoaded, fetchUserData]);

  const refreshUserData = useCallback(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider
      value={{
        ...userData,
        refreshUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData phải được sử dụng bên trong một UserDataProvider");
  }
  return context;
}