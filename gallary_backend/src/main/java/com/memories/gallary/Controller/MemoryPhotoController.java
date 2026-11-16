package com.memories.gallary.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.memories.gallary.Entity.MemoryPhoto;
import com.memories.gallary.Service.MemoryPhotoService;

@RestController
@RequestMapping("/api/memory-photos")
@CrossOrigin(origins = "http://localhost:5173")
public class MemoryPhotoController {

    private final MemoryPhotoService memoryPhotoService;

    public MemoryPhotoController(
            MemoryPhotoService memoryPhotoService) {
        this.memoryPhotoService = memoryPhotoService;
    }

    // Upload photo
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("memoryId") Long memoryId) {

        return ResponseEntity.ok(
                memoryPhotoService.uploadPhoto(file, memoryId));
    }

    // Get photos for a particular memory
    @GetMapping("/memory/{memoryId}")
    public ResponseEntity<List<Map<String, Object>>> getPhotos(
            @PathVariable Long memoryId) {

        return ResponseEntity.ok(
                memoryPhotoService.getPhotosByMemory(memoryId));
    }

    // Display uploaded image
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getPhoto(
            @PathVariable String filename) {

        MemoryPhoto photo = memoryPhotoService.getPhotoByFileName(filename);

        Resource resource = memoryPhotoService.loadPhoto(filename);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        try {
            if (photo.getContentType() != null) {
                mediaType = MediaType.parseMediaType(
                        photo.getContentType());
            }
        } catch (Exception ignored) {
            // Use default content type.
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    // Delete photo
    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable String filename) {

        memoryPhotoService.deletePhoto(filename);

        return ResponseEntity.noContent().build();
    }
}
