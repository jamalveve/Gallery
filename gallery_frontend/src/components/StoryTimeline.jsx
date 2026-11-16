
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMemories } from "../services/memoryService";

export default function StoryTimeline() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMemories() {
      try {
        const data = await getMemories();
        setTimelineData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMemories();
  }, []);

  return (
    <section className="story-section" id="story">
      <p className="eyebrow">♥ THE BEGINNING OF FOREVER ♥</p>

      <h2>Our Love Story</h2>

      <p className="section-intro">
        From our first hello to forever, here are some of
        our favourite moments together.
      </p>

      {loading ? (
        <p>Loading our memories...</p>
      ) : error ? (
        <p className="status-message">{error}</p>
      ) : (
        <div className="timeline">
          {timelineData.map((item) => (
            <Link
              to={`/memories/${item.slug}`}
              className="timeline-item"
              key={item.id}
            >
              <img
                src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=300&q=80`}
                alt={item.title}
              />

              <span className="timeline-heart">♥</span>

              <h3>{item.title}</h3>
              <p>{item.date}</p>

              <span className="view-memory">
                View memories →
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
