
import { useEffect, useState } from "react";

export default function useCountdown(startDate) {
  const calculateTime = () => {
    const start = new Date(startDate);
    const now = new Date();

    const difference = Math.max(0, now.getTime() - start.getTime());

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return timeLeft;
}
