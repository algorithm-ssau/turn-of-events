package com.example.eventservice.controller;

import com.example.eventservice.dto.EventDto;
import com.example.eventservice.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Создание нового события (доступно только организаторам и администраторам)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto) {
        logCurrentUser("Создание события");
        return new ResponseEntity<>(eventService.createEvent(eventDto), HttpStatus.CREATED);
    }

    /**
     * Получение события по ID (публично доступно)
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        logCurrentUser("Получение события по ID: " + id);
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    /**
     * Получение списка событий с пагинацией (публично доступно)
     */
    @GetMapping
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(eventService.getEvents(pageable));
    }

    /**
     * Получение всех событий без пагинации (публично доступно)
     */
    @GetMapping("/all")
    public ResponseEntity<List<EventDto>> listAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    /**
     * Обновление события (доступно только организаторам и администраторам)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long id, 
            @Valid @RequestBody EventDto eventDto) {
        logCurrentUser("Обновление события с ID: " + id);
        return ResponseEntity.ok(eventService.updateEvent(id, eventDto));
    }

    /**
     * Удаление события (доступно только администраторам)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        logCurrentUser("Удаление события с ID: " + id);
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Поиск событий по заголовку (публично доступно)
     */
    @GetMapping("/search")
    public ResponseEntity<List<EventDto>> searchEventsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(eventService.searchEventsByTitle(title));
    }

    /**
     * Поиск событий по месту проведения (публично доступно)
     */
    @GetMapping("/place/{place}")
    public ResponseEntity<List<EventDto>> findEventsByPlace(@PathVariable String place) {
        return ResponseEntity.ok(eventService.findEventsByPlace(place));
    }

    /**
     * Поиск событий по жанру (публично доступно)
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<EventDto>> findEventsByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(eventService.findEventsByGenre(genre));
    }
    
    /**
     * Вспомогательный метод для логирования информации о текущем пользователе
     */
    private void logCurrentUser(String action) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            System.out.println(action + " выполнено пользователем: " + authentication.getName() + 
                              " с ролями: " + authentication.getAuthorities());
        }
    }
} 