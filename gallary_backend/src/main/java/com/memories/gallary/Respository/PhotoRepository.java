
package com.memories.gallary.Respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.memories.gallary.Entity.Photo;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByAlbumId(Long albumId);

    Optional<Photo> findByFileName(String fileName);
}
