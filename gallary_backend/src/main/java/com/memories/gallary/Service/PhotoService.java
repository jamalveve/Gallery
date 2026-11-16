
package com.memories.gallary.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.memories.gallary.Entity.Album;
import com.memories.gallary.Entity.Photo;
import com.memories.gallary.Respository.AlbumRepository;
import com.memories.gallary.Respository.PhotoRepository;

@Service
public class PhotoService {

    private final Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;

    public PhotoService(
            PhotoRepository photoRepository,
            AlbumRepository albumRepository) throws IOException {

        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;

        Files.createDirectories(uploadDir);
    }

    // Upload photo and save its details in MySQL
    public Photo uploadPhoto(MultipartFile file, Long albumId)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a photo");
        }

        String contentType = file.getContentType();
        String originalFileName = file.getOriginalFilename();

        if (originalFileName != null &&
                originalFileName.toLowerCase().endsWith(".mov")) {
            contentType = "video/quicktime";
        }

        if (contentType == null ||
                !(contentType.startsWith("image/") ||
                        contentType.startsWith("video/"))) {
            throw new RuntimeException(
                    "Only image and video files are allowed");
        }

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        String originalName = Paths.get(
                file.getOriginalFilename() == null
                        ? "photo"
                        : file.getOriginalFilename())
                .getFileName().toString();

        String extension = originalName.contains(".")
                ? originalName.substring(
                        originalName.lastIndexOf("."))
                : "";

        String filename = UUID.randomUUID() + extension;

        Path destination = uploadDir.resolve(filename).normalize();

        if (!destination.startsWith(uploadDir)) {
            throw new IOException("Invalid file path");
        }

        // Save actual image file
        Files.copy(file.getInputStream(), destination);

        try {
            // Create database record
            Photo photo = new Photo();

            photo.setFileName(filename);
            photo.setContentType(contentType);
            photo.setAlbum(album);

            return photoRepository.save(photo);

        } catch (RuntimeException e) {
            // Remove uploaded file if database save fails
            Files.deleteIfExists(destination);
            throw e;
        }
    }

    // Get all photo filenames from MySQL
    public List<String> getAllPhotos() {

        return photoRepository.findAll()
                .stream()
                .map(Photo::getFileName)
                .collect(Collectors.toList());
    }

    // Get photos belonging to one album
    public List<Map<String, Object>> getPhotosByAlbum(Long albumId) {

        if (!albumRepository.existsById(albumId)) {
            throw new RuntimeException("Album not found");
        }

        return photoRepository.findByAlbumId(albumId)
                .stream()
                .map(photo -> Map.<String, Object>of(
                        "id", photo.getId(),
                        "filename", photo.getFileName(),
                        "contentType", photo.getContentType(),
                        "uploadedAt", photo.getUploadedAt()))
                .collect(Collectors.toList());
    }

    // // View individual photo
    // public ResponseEntity<?> getPhoto(String filename)
    // throws IOException {

    // Path path = uploadDir.resolve(filename).normalize();

    // if (!path.startsWith(uploadDir) ||
    // !Files.isRegularFile(path)) {
    // return ResponseEntity.notFound().build();
    // }

    // Resource resource = new UrlResource(path.toUri());

    // String contentType = Files.probeContentType(path);

    // MediaType mediaType = contentType != null &&
    // contentType.startsWith("image/")
    // ? MediaType.parseMediaType(contentType)
    // : MediaType.APPLICATION_OCTET_STREAM;

    // return ResponseEntity.ok()
    // .contentType(mediaType)
    // .body(resource);
    // }

    // View or play an image/video
    public ResponseEntity<?> getPhoto(String filename)
            throws IOException {

        Path path = uploadDir.resolve(filename).normalize();

        if (!path.startsWith(uploadDir) ||
                !Files.isRegularFile(path)) {
            return ResponseEntity.notFound().build();
        }

        // Find the saved media details in MySQL
        Photo photo = photoRepository.findByFileName(filename)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        Resource resource = new UrlResource(path.toUri());

        // Get the content type saved in MySQL
        String contentType = photo.getContentType();

        // If content type is missing or generic, try detecting it
        if (contentType == null ||
                contentType.equals("application/octet-stream")) {
            contentType = Files.probeContentType(path);
        }

        MediaType mediaType;

        try {
            mediaType = contentType != null
                    ? MediaType.parseMediaType(contentType)
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(Files.size(path))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(filename)
                                .build()
                                .toString())
                .body(resource);
    }

    // Delete photo from disk and MySQL
    public void deletePhoto(String filename)
            throws IOException {

        Photo photo = photoRepository.findByFileName(filename)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        Path path = uploadDir.resolve(filename).normalize();

        if (!path.startsWith(uploadDir)) {
            throw new RuntimeException("Invalid file path");
        }

        Files.deleteIfExists(path);

        photoRepository.delete(photo);
    }

    // Delete image files belonging to an album
    public void deleteFilesForAlbum(Long albumId)
            throws IOException {

        List<Photo> photos = photoRepository.findByAlbumId(albumId);

        for (Photo photo : photos) {

            Path path = uploadDir.resolve(
                    photo.getFileName()).normalize();

            if (!path.startsWith(uploadDir)) {
                throw new RuntimeException("Invalid file path");
            }

            Files.deleteIfExists(path);
        }
    }
}
