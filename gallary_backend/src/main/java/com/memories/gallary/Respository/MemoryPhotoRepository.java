package com.memories.gallary.Respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.memories.gallary.Entity.MemoryPhoto;

public interface MemoryPhotoRepository
        extends JpaRepository<MemoryPhoto, Long> {

    List<MemoryPhoto> findByMemory_IdOrderByUploadedAtDesc(Long memoryId);

    Optional<MemoryPhoto> findByFileName(String fileName);
}
