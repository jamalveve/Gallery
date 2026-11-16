
package com.memories.gallary.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.memories.gallary.Entity.Memory;
import com.memories.gallary.Entity.MemoryPhoto;
import com.memories.gallary.Respository.MemoryPhotoRepository;
import com.memories.gallary.Respository.MemoryRepository;

@Service
public class MemoryPhotoService {

    private final MemoryPhotoRepository photoRepository;
    private final MemoryRepository memoryRepository;

    private final Path uploadDirectory = Paths.get("uploads", "memory-photos")
            .toAbsolutePath()
            .normalize();

    public MemoryPhotoService(
            MemoryPhotoRepository photoRepository,
            MemoryRepository memoryRepository) {

        this.photoRepository = photoRepository;
        this.memoryRepository = memoryRepository;
    }

    // Upload photo and connect it to a memory
    public Map<String, Object> uploadPhoto(
            MultipartFile file, Long memoryId) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Please select an image");
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only image files are allowed");
        }

        Memory memory = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Memory not found"));

        try {
            Files.createDirectories(uploadDirectory);

            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(
                        originalName.lastIndexOf("."))
                        .replaceAll("[^a-zA-Z0-9.]", "");
            }

            String fileName = UUID.randomUUID() + extension;

            Path destination = uploadDirectory.resolve(fileName).normalize();

            if (!destination.startsWith(uploadDirectory)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid filename");
            }

            Files.copy(file.getInputStream(), destination);

            MemoryPhoto photo = new MemoryPhoto();
            photo.setFileName(fileName);
            photo.setContentType(contentType);
            photo.setMemory(memory);

            MemoryPhoto savedPhoto = photoRepository.save(photo);

            return convertToResponse(savedPhoto);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save image", e);
        }
    }

    // Get all photos belonging to one memory
    public List<Map<String, Object>> getPhotosByMemory(Long memoryId) {

        if (!memoryRepository.existsById(memoryId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Memory not found");
        }

        return photoRepository
                .findByMemory_IdOrderByUploadedAtDesc(memoryId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get photo details by filename
    public MemoryPhoto getPhotoByFileName(String fileName) {

        return photoRepository.findByFileName(fileName)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Photo not found"));
    }

    // Load actual image file
    public Resource loadPhoto(String fileName) {

        try {
            Path filePath = uploadDirectory.resolve(fileName).normalize();

            if (!filePath.startsWith(uploadDirectory)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid filename");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Image file not found");
            }

            return resource;

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Image file not found", e);
        }
    }

    // Delete photo from database and storage
    public void deletePhoto(String fileName) {

        MemoryPhoto photo = getPhotoByFileName(fileName);

        Path filePath = uploadDirectory.resolve(fileName).normalize();

        try {
            Files.deleteIfExists(filePath);
            photoRepository.delete(photo);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not delete image", e);
        }
    }

    // Convert entity to JSON response
    private Map<String, Object> convertToResponse(MemoryPhoto photo) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", photo.getId());
        response.put("filename", photo.getFileName());
        response.put("contentType", photo.getContentType());
        response.put("uploadedAt", photo.getUploadedAt());

        return response;
    }
}
