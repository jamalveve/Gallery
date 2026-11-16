
import useCountdown from "../hooks/useCountdown";

const SPECIAL_DATE = "2022-04-01T00:00:00";
export default function Countdown() {
  const timeLeft = useCountdown(SPECIAL_DATE);

  const units = [
    ["days", "Days"],
    ["hours", "Hours"],
    ["minutes", "Minutes"],
    ["seconds", "Seconds"],
  ];

  return (
    <section className="countdown-section" id="countdown">
      <div className="countdown-copy">
        <p className="eyebrow">♥ COUNTING DOWN ♥</p>

        <h2>
          To Many More
          <br />
          <em>Beautiful Years</em>
        </h2>

        <p>
          Every moment with you is a gift.
          Let's keep making memories together.
        </p>
      </div>

      <div className="timer">
        {units.map(([key, label]) => (
          <div className="time-card" key={key}>
            <strong>
              {String(timeLeft[key]).padStart(2, "0")}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
