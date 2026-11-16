
import { useCallback, useEffect, useState } from "react";
import {
  getPhotos,
  uploadPhoto as uploadPhotoApi,
  deletePhoto as deletePhotoApi,
} from "../services/photoService";

export default function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPhotos = useCallback(async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function uploadPhoto(file) {
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      await uploadPhotoApi(file);
      setMessage("Your memory has been uploaded ❤️");
      await loadPhotos();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(filename) {
    try {
      await deletePhotoApi(filename);
      setMessage("Photo deleted successfully.");
      await loadPhotos();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return {
    photos,
    uploading,
    message,
    uploadPhoto,
    removePhoto,
  };
}
