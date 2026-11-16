
import { Link } from "react-router-dom";

export default function Gallery() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-heading">
        <p className="eyebrow">♥ OUR MEMORIES</p>

        <h2>
          A Gallery Full
          <br />
          <em>of Love</em>
        </h2>

        <p>
          Every adventure, every smile and every special
          moment, collected in one little place.
        </p>

        <Link to="/albums" className="primary-button">
          Click to See Gallery →
        </Link>
      </div>

      <div className="gallery-heart-wrap">

        {/* Romantic rose on the top-left */}
        <span className="gallery-rose gallery-rose-left">
          🌹
        </span>

        {/* Heart-shaped photo preview */}
        <div className="gallery-heart-preview">

          <div className="heart-photo heart-photo-one">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=80"
              alt="A special memory"
            />
          </div>

          <div className="heart-photo heart-photo-two">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80"
              alt="A beautiful celebration"
            />
          </div>

          <div className="heart-caption">
            Our little world ♥
          </div>

        </div>

        {/* Romantic rose on the top-right */}
        <span className="gallery-rose gallery-rose-right">
          🌹
        </span>

      </div>
    </section>
  );
}
