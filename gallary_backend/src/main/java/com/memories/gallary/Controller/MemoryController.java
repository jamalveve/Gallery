package com.memories.gallary.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.memories.gallary.Entity.Memory;
import com.memories.gallary.Service.MemoryService;

@RestController
@RequestMapping("/api/memories")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://gallery-flame-nine-95.vercel.app"
})

public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping
    public ResponseEntity<List<Memory>> getAllMemories() {
        return ResponseEntity.ok(memoryService.getAllMemories());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Memory> getMemoryBySlug(
            @PathVariable String slug) {

        return memoryService.getMemoryBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
