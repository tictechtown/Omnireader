import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function useAppState(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const appState = useRef(AppState.currentState);
  const lastTimeVisible = useRef(Date.now());
  const [needQueryRefetch, setNeedQueryRefech] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const blurSubscription = AppState.addEventListener("blur", () => {
      console.log("[BACKGROUND]", appState.current, "->", "background");
      appState.current = "background";
      lastTimeVisible.current = Date.now();
      // console.log("[BLUR]", appState.current, nextAppState);
    });
    const focusSubscription = AppState.addEventListener("focus", () => {
      console.log("[FOCUS]", appState.current, "->", "active");
      if (appState.current !== "active") {
        const timeInMS = Date.now() - lastTimeVisible.current;
        console.log(
          "refetching queries?",
          timeInMS / 1000,
          Date.now(),
          lastTimeVisible.current
        );
        lastTimeVisible.current = Date.now();
        // 5 mins has passed since last refrech, we refetch the data
        if (timeInMS > 1000 * 15 * 60) {
          console.log("refetching queries");
          setNeedQueryRefech(true);
        }
      }
      appState.current = "active";
    });

    return () => {
      blurSubscription.remove();
      focusSubscription.remove();
    };
  }, []);

  return [needQueryRefetch, setNeedQueryRefech];
}
