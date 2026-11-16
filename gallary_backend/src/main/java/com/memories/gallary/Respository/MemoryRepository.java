package com.memories.gallary.Respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.memories.gallary.Entity.Memory;

public interface MemoryRepository extends JpaRepository<Memory, Long> {

    Optional<Memory> findBySlug(String slug);
}
