
const API = "http://localhost:8080/api/memory-photos";

// Upload one photo for a memory
export async function uploadMemoryPhoto(file, memoryId) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API}/upload?memoryId=${memoryId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Photo upload failed");
  }

  return response.json();
}

// Get all photos belonging to a memory
export async function getMemoryPhotos(memoryId) {
  const response = await fetch(`${API}/memory/${memoryId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch memory photos");
  }

  return response.json();
}

// Get the image URL
export function getMemoryPhotoUrl(filename) {
  return `${API}/${encodeURIComponent(filename)}`;
}

// Delete a memory photo
export async function deleteMemoryPhoto(filename) {
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
