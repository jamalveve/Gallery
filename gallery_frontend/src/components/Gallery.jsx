
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
    </section>
  );
}
