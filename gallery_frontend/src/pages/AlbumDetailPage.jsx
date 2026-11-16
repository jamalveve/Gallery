
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAlbums,
  getPhotosByAlbum,
  uploadPhoto,
  deletePhoto,
  getPhotoUrl,
} from "../services/photoService";

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const numericAlbumId = Number(albumId);

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAlbum() {
      setLoading(true);

      try {
        const albums = await getAlbums();

        const selectedAlbum = albums.find(
          (item) => Number(item.id) === numericAlbumId
        );

        if (!selectedAlbum) {
          setAlbum(null);
          setPhotos([]);
          return;
        }

        setAlbum(selectedAlbum);

        const albumPhotos = await getPhotosByAlbum(numericAlbumId);
        setPhotos(albumPhotos);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbum();
  }, [numericAlbumId]);

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setUploading(true);
    setMessage("");

    let uploadedCount = 0;

    try {
      for (const file of files) {
        await uploadPhoto(file, numericAlbumId);
        uploadedCount++;
      }

      const updatedPhotos = await getPhotosByAlbum(numericAlbumId);
      setPhotos(updatedPhotos);

setMessage(`${uploadedCount} file(s) added successfully ❤️`);
    } catch (error) {
      // Refresh the photos in case some uploads succeeded.
      try {
        const updatedPhotos = await getPhotosByAlbum(numericAlbumId);
        setPhotos(updatedPhotos);
      } catch {
        // Keep the current photos if refreshing fails.
      }

      setMessage(
        `${uploadedCount} uploaded; ${error.message}. Please retry the remaining photos.`
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(filename) {
   if (!window.confirm("Delete this photo or video permanently?")) return;
    try {
      await deletePhoto(filename);

      setPhotos((previousPhotos) =>
        previousPhotos.filter((photo) => photo.filename !== filename)
      );

   setMessage("File deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) {
    return (
      <section className="album-detail-page">
        <p>Loading album...</p>
      </section>
    );
  }

  if (!album) {
    return (
      <section className="memory-not-found">
        <h2>Album not found ♡</h2>
        <Link to="/albums">Back to albums</Link>
      </section>
    );
  }

  return (
    <section className="album-detail-page">
      <div className="album-detail-heading">
        <Link to="/albums" className="back-link">
          ← All Albums
        </Link>

        <p className="eyebrow">♥ A CHAPTER OF OUR STORY ♥</p>

        <h1>{album.name}</h1>
        <p>{album.description}</p>

        <label className="primary-button upload-button">
          {uploading ? "Uploading..." : "＋ Upload Images to This Album"}

          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
        <label className="primary-button upload-button">
  {uploading ? "Uploading..." : "＋ Upload Videos to This Album"}

  <input
    type="file"
    accept="video/*,.mov,.mp4,.webm,.avi"
    multiple
    hidden
    disabled={uploading}
    onChange={handleUpload}
  />
</label>

        {message && <p className="status-message">{message}</p>}
      </div>

      {photos.length > 0 && (
        <div className="album-photos-grid">
          {photos.map((photo) => (
            <div className="album-photo" key={photo.id}>
             {photo.contentType?.startsWith("video/") ? (
  <video
    controls
    preload="metadata"
    className="album-video"
  >
    <source
      src={getPhotoUrl(photo.filename)}
      type={photo.contentType}
    />
    Your browser does not support this video.
  </video>
) : (
  <img
    src={getPhotoUrl(photo.filename)}
    alt={album.name}
  />
)}
              <button
                onClick={() => handleDelete(photo.filename)}
                aria-label="Delete photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
