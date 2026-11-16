package com.memories.gallary.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.memories.gallary.Entity.Memory;
import com.memories.gallary.Respository.MemoryRepository;

@Service
public class MemoryService {

    private final MemoryRepository memoryRepository;

    public MemoryService(MemoryRepository memoryRepository) {
        this.memoryRepository = memoryRepository;
    }

    public List<Memory> getAllMemories() {
        return memoryRepository.findAll();
    }

    public Optional<Memory> getMemoryBySlug(String slug) {
        return memoryRepository.findBySlug(slug);
    }
}
