
import { useEffect, useState } from "react";

const STORAGE_KEY = "our-memory-albums";

const initialAlbums = [
  { id: "outings", name: "Outings", description: "Our little adventures", photos: [] },
  { id: "random-evenings", name: "Random Evenings", description: "Unexpected beautiful moments", photos: [] },
  { id: "favourite-moments", name: "Favourite Moments", description: "Memories close to our hearts", photos: [] },
  { id: "beach-photos", name: "Beach Photos", description: "Sandy toes and ocean views", photos: [] },
  { id: "kerala-trip", name: "Kerala Trip", description: "Our beautiful Kerala journey", photos: [] },
  { id: "first-umrah", name: "First Umrah", description: "A journey we'll always cherish", photos: [] },
];

export default function useAlbums() {
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialAlbums;
    } catch {
      return initialAlbums;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
  }, [albums]);

  function addAlbum(name, description) {
    const id = `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    setAlbums((current) => [
      ...current,
      { id, name: name.trim(), description: description.trim(), photos: [] },
    ]);
  }

  function deleteAlbum(id) {
    setAlbums((current) => current.filter((album) => album.id !== id));
  }

  function addPhotos(id, filenames) {
    setAlbums((current) =>
      current.map((album) =>
        album.id === id
          ? { ...album, photos: [...new Set([...album.photos, ...filenames])] }
          : album
      )
    );
  }

  function removePhoto(id, filename) {
    setAlbums((current) =>
      current.map((album) =>
        album.id === id
          ? { ...album, photos: album.photos.filter((photo) => photo !== filename) }
          : album
      )
    );
  }

  return { albums, addAlbum, deleteAlbum, addPhotos, removePhoto };
}
