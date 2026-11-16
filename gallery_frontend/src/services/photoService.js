
const API = "http://localhost:8080/api/photos";
const ALBUM_API = "http://localhost:8080/api/albums";

// Get all albums
export async function getAlbums() {
  const response = await fetch(ALBUM_API);

  if (!response.ok) {
    throw new Error("Failed to fetch albums");
  }

  return response.json();
}

// Create album
export async function createAlbum(name, description = "") {
  const response = await fetch(ALBUM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error("Failed to create album");
  }

  return response.json();
}

// Delete album
export async function deleteAlbum(id) {
  const response = await fetch(`${ALBUM_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete album");
  }
}

// Upload photo into selected album
export async function uploadPhoto(file, albumId) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API}/upload?albumId=${albumId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Photo upload failed");
  }

  return response.json();
}

// Get photos belonging to an album
export async function getPhotosByAlbum(albumId) {
  const response = await fetch(`${API}/album/${albumId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch album photos");
  }

  return response.json();
}

// Get photo URL
export function getPhotoUrl(filename) {
  return `${API}/${encodeURIComponent(filename)}`;
}

// Delete photo
export async function deletePhoto(filename) {
  const response = await fetch(
    `${API}/${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete photo");
  }
}
