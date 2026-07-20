"use client";

import { useEffect, useRef, useState } from "react";

export function useOtp(resendSeconds = 30) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setSecondsLeft(resendSeconds);
  };

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [secondsLeft]);

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    startTimer,
  };
}

export default useOtp;
