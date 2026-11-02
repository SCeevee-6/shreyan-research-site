import { practiceLevels, practiceLog } from "@/data/music";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** The practice log as ink dots: one column a week, one dot a day, darker and larger for longer sessions. */
export function PracticeLog() {
  const weeks = practiceLog.split(" ").map((w) => [...w].map(Number));
  const days = weeks.flat();
  const hours = days.reduce((s, l) => s + [0, 0.25, 0.5, 0.83, 1.25][l], 0);
  return (
    <figure className="practice">
      <div className="practice-grid" role="img" aria-label={`Practice log: ${days.filter(Boolean).length} of ${days.length} days practised, about ${Math.round(hours)} hours.`}>
        {weeks.map((w, i) => (
          <div key={i} className="practice-week">
            {w.map((l, d) => (
              <span key={d} className="practice-dot" data-l={l} title={`${DAYS[d]}: ${practiceLevels[l]}`} />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="practice-key">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="practice-dot" data-l={l} />
        ))}
        <span>more</span>
        <span className="ml-auto italic">one dot a day, a column a week</span>
      </figcaption>
    </figure>
  );
}
