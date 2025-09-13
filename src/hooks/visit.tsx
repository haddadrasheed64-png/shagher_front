// useTrackVisit.ts
import { useEffect } from "react";
import axios from "axios";

export function Visit_Hook() {
  useEffect(() => {
    try {
      const visitedThisSession = sessionStorage.getItem(
        "shagher_session_visit"
      );
      if (!visitedThisSession) {
        // أول مرة بالجلسة → نرسل API
        axios
          .post("https://shagher.onrender.com/website", { method: "visit" })
          .catch((err) => {
            console.error("track visit failed", err);
          });

        // نخزن علامة الجلسة
        sessionStorage.setItem("shagher_session_visit", "1");
      }
    } catch (e) {
      console.warn("sessionStorage not available", e);
    }
  }, []);
}
