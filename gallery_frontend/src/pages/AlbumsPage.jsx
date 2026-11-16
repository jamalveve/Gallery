
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAlbums,
  createAlbum,
  deleteAlbum,
} from "../services/photoService";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        setMessage(error.message);
      }
    }

    fetchAlbums();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();

    if (!name.trim()) return;

    try {
      const newAlbum = await createAlbum(name.trim(), description);
      setAlbums((previousAlbums) => [...previousAlbums, newAlbum]);

      setName("");
      setDescription("");
      setShowForm(false);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete(id, albumName) {
    if (!window.confirm(`Delete the "${albumName}" album?`)) return;

    try {
      await deleteAlbum(id);
      setAlbums((previousAlbums) =>
        previousAlbums.filter((album) => album.id !== id)
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="albums-page">
      <div className="albums-heading">
        <p className="eyebrow">♥ OUR LITTLE WORLD ♥</p>
        <h1>Our Memory Albums</h1>
        <p>Every album holds a different chapter of our story.</p>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Create New Album
        </button>
      </div>

      {message && <p className="status-message">{message}</p>}

      {showForm && (
        <form className="album-form" onSubmit={handleCreate}>
          <h2>Create a New Album ♡</h2>

          <input
            placeholder="Album name (e.g. Our Ooty Trip)"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <textarea
            placeholder="A little description..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <button className="primary-button" type="submit">
            Create Album
          </button>
        </form>
      )}

      <div className="albums-grid">
        {albums.map((album) => (
          <article className="album-card" key={album.id}>
            <Link
              to={`/albums/${album.id}`}
              className="album-card-link"
            >
              <div className="album-cover">
                <span>♡</span>
              </div>

              <div className="album-card-info">
                <h2>{album.name}</h2>
                <p>{album.description}</p>
                <small>Open album →</small>
              </div>
            </Link>

            <button
              className="album-delete"
              onClick={() => handleDelete(album.id, album.name)}
              aria-label={`Delete ${album.name} album`}
            >
              Delete album
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
