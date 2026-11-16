
package com.memories.gallary.Controller;

import java.io.IOException;
import java.util.Map;

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

import com.memories.gallary.Service.PhotoService;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotoController {

    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    // Upload photo into a selected album
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("albumId") Long albumId) {

        try {
            var photo = photoService.uploadPhoto(file, albumId);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Photo uploaded successfully",
                            "id", photo.getId(),
                            "filename", photo.getFileName(),
                            "contentType", photo.getContentType()));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get all photo filenames
    @GetMapping
    public ResponseEntity<?> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    // Get photos belonging to a particular album
    @GetMapping("/album/{albumId}")
    public ResponseEntity<?> getPhotosByAlbum(
            @PathVariable Long albumId) {

        try {
            return ResponseEntity.ok(
                    photoService.getPhotosByAlbum(albumId));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // View individual photo
    @GetMapping("/{filename}")
    public ResponseEntity<?> getPhoto(
            @PathVariable String filename) {

        try {
            return photoService.getPhoto(filename);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Delete photo
    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deletePhoto(
            @PathVariable String filename) {

        try {
            photoService.deletePhoto(filename);

            return ResponseEntity.ok(
                    Map.of("message", "Photo deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
