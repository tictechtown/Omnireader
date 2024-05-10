import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "automatic" | "light" | "dark" | "amoled";
export type ListType = "card" | "row";
interface Settings {
  theme: Theme; // automatic | light | dark | amoled
  setTheme(value: Theme): void;
  listType: ListType;
  setListType(value: ListType): void;
  toggleListType(): void;
  authToken: string;
  setAuthToken(value: string): void;
  clearAuthToken(): void;
}

export const useSettingsStore = create(
  persist<Settings>(
    (set, get) => ({
      theme: "automatic" as Theme,
      setTheme(value) {
        set({ theme: value });
      },
      listType: "card" as ListType,
      setListType(value) {
        set({ listType: value });
      },
      toggleListType() {
        set(({ listType }) => ({
          listType: listType === "card" ? "row" : "card",
        }));
      },
      authToken: null,
      setAuthToken(value) {
        set({ authToken: value });
      },
      clearAuthToken() {
        set({ authToken: null });
      },
    }),
    {
      name: "settings", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useSettingsStore.persist.onHydrate(() =>
      setHydrated(false)
    );

    const unsubFinishHydration = useSettingsStore.persist.onFinishHydration(
      () => setHydrated(true)
    );

    setHydrated(useSettingsStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

export const getStoredAPIToken = async () => {
  if (useSettingsStore.persist.hasHydrated()) {
    return useSettingsStore.getState().authToken;
  }
  const promise = new Promise((resolve) => {
    useSettingsStore.persist.onFinishHydration(() => {
      resolve(true);
    });
  });
  await promise;
  return useSettingsStore.getState().authToken;
};
