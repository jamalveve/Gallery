
package com.memories.gallary.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.memories.gallary.Entity.Album;
import com.memories.gallary.Respository.AlbumRepository;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final PhotoService photoService;

    public AlbumService(
            AlbumRepository albumRepository,
            PhotoService photoService) {

        this.albumRepository = albumRepository;
        this.photoService = photoService;
    }

    // Create album
    public Album createAlbum(Album album) {
        return albumRepository.save(album);
    }

    // Get all albums
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    // Get album by ID
    public Optional<Album> getAlbumById(Long id) {
        return albumRepository.findById(id);
    }

    // Delete album and its image files
    public void deleteAlbum(Long id) throws IOException {

        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        photoService.deleteFilesForAlbum(id);

        albumRepository.delete(album);
    }
}
