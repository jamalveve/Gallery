
// const API = "http://localhost:8080/api/memories";

const API = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/memories`;
export async function getMemories() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Failed to fetch memories");
  }

  return response.json();
}

export async function getMemoryBySlug(slug) {
  const response = await fetch(`${API}/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Memory not found");
    }

    throw new Error("Failed to fetch memory");
  }

  return response.json();
}
