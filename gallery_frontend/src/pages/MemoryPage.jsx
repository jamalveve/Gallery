
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMemoryBySlug } from "../services/memoryService";

import {
  getMemoryPhotos,
  uploadMemoryPhoto,
  getMemoryPhotoUrl,
  deleteMemoryPhoto,
} from "../services/memoryPhotoService";

export default function MemoryPage() {
  const { slug } = useParams();

  const [memory, setMemory] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  // Fetch memory from the memories table
  useEffect(() => {
    async function fetchMemory() {
      setLoading(true);
      setMemory(null);
      setPhotos([]);
      setMessage("");

      try {
        const data = await getMemoryBySlug(slug);
        setMemory(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMemory();
  }, [slug]);

  // Fetch photos using memory database ID
  useEffect(() => {
    if (!memory?.id) return;

    async function fetchPhotos() {
      setPhotosLoading(true);

      try {
        const data = await getMemoryPhotos(memory.id);
        setPhotos(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setPhotosLoading(false);
      }
    }

    fetchPhotos();
  }, [memory]);

  // Upload selected images
  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length || !memory?.id) return;

    setUploading(true);
    setMessage("");

    let uploadedCount = 0;

    try {
      for (const file of files) {
        await uploadMemoryPhoto(file, memory.id);
        uploadedCount++;
      }

      const updatedPhotos = await getMemoryPhotos(memory.id);
      setPhotos(updatedPhotos);

      setMessage(
        `${uploadedCount} photo(s) uploaded successfully ❤️`
      );
    } catch (error) {
      setMessage(`${uploadedCount} uploaded; ${error.message}`);

      try {
        const updatedPhotos = await getMemoryPhotos(memory.id);
        setPhotos(updatedPhotos);
      } catch {
        // Keep currently displayed photos.
      }
    } finally {
      setUploading(false);
    }
  }

  // Delete selected image
  async function handleDelete(filename) {
    if (!window.confirm("Delete this photo permanently?")) return;

    try {
      await deleteMemoryPhoto(filename);

      setPhotos((previousPhotos) =>
        previousPhotos.filter(
          (photo) => photo.filename !== filename
        )
      );

      setMessage("Photo deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Memory loading
  if (loading) {
    return <p>Loading memory...</p>;
  }

  // Memory not found
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

          <label className="primary-button upload-button">
            {uploading ? "Uploading..." : "＋ Upload Images"}

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>

          {message && (
            <p className="status-message">{message}</p>
          )}
        </div>

        {photosLoading ? (
          <p>Loading memories...</p>
        ) : photos.length > 0 ? (
          <div className="memory-photo-grid">
            {photos.map((photo) => (
              <div className="memory-photo-card" key={photo.id}>
                <img
                  src={getMemoryPhotoUrl(photo.filename)}
                  alt={`${memory.title} memory`}
                />

                <button
                  onClick={() => handleDelete(photo.filename)}
                  aria-label="Delete photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="memory-empty">
            <span>♡</span>

            <h3>Our memories are waiting here</h3>

            <p>
              Upload your {memory.title.toLowerCase()} photos
              to keep these moments forever.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
