
import { Link, useParams } from "react-router-dom";
import timelineData from "../data/timelineData";
import { getPhotoUrl } from "../services/photoService";

export default function MemoryPage() {
  const { slug } = useParams();

  const memory = timelineData.find(
    (item) => item.slug === slug
  );

  if (!memory) {
    return (
      <section className="memory-not-found">
        <h2>Memory not found ♡</h2>
        <Link to="/">Return to homepage</Link>
      </section>
    );
  }

  return (
    <div className="memory-page">

      <section className="memory-hero">
        <p className="eyebrow">♥ OUR BEAUTIFUL MEMORIES ♥</p>

        <h1>{memory.title}</h1>

        <p className="memory-date">{memory.date}</p>

        <p className="memory-description">
          {memory.description}
        </p>

        <Link to="/" className="primary-button">
          ← Back to Our Story
        </Link>
      </section>

      <section className="memory-gallery">
        <div className="memory-gallery-heading">
          <p className="eyebrow">♥ CAPTURED MOMENTS</p>
          <h2>Our {memory.title} Memories</h2>
          <p>Every photograph holds a little piece of our story.</p>
        </div>

        {memory.photos.length > 0 ? (
          <div className="memory-photo-grid">
            {memory.photos.map((filename) => (
              <div className="memory-photo-card" key={filename}>
                <img
                  src={getPhotoUrl(filename)}
                  alt={`${memory.title} memory`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="memory-empty">
            <span>♡</span>
            <h3>Our memories are waiting here</h3>
            <p>
              Add your {memory.title.toLowerCase()} photos
              to this album.
            </p>
            <Link to="/" className="primary-button">
              Back to Homepage
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
