package com.example.eventservice.controller;

import com.example.eventservice.dto.EventDto;
import com.example.eventservice.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

@Tag(name = "События", description = "Операции с событиями")
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Создание нового события (доступно только организаторам и администраторам)
     */
    @Operation(summary = "Создать новое событие")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Событие успешно создано"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto) {
        logCurrentUser("Создание события");
        return new ResponseEntity<>(eventService.createEvent(eventDto), HttpStatus.CREATED);
    }

    /**
     * Получение события по ID (публично доступно)
     */
    @Operation(summary = "Получить событие по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Событие успешно получено"),
            @ApiResponse(responseCode = "404", description = "Событие не найдено")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        logCurrentUser("Получение события по ID: " + id);
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    /**
     * Получение списка событий с пагинацией (публично доступно)
     */
    @Operation(summary = "Получить список событий с пагинацией")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список событий успешно получен"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
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
    @Operation(summary = "Получить все события")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список всех событий успешно получен"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/all")
    public ResponseEntity<List<EventDto>> listAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    /**
     * Обновление события (доступно только организаторам и администраторам)
     */
    @Operation(summary = "Обновить событие")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Событие успешно обновлено"),
            @ApiResponse(responseCode = "404", description = "Событие не найдено"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
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
    @Operation(summary = "Удалить событие")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Событие успешно удалено"),
            @ApiResponse(responseCode = "404", description = "Событие не найдено")
    })
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
    @Operation(summary = "Поиск событий по заголовку")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список событий найден по заголовку"),
            @ApiResponse(responseCode = "404", description = "События не найдены")
    })
    @GetMapping("/search")
    public ResponseEntity<List<EventDto>> searchEventsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(eventService.searchEventsByTitle(title));
    }

    /**
     * Поиск событий по месту проведения (публично доступно)
     */
    @Operation(summary = "Поиск событий по месту проведения")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список событий найден по месту проведения"),
            @ApiResponse(responseCode = "404", description = "События не найдены")
    })
    @GetMapping("/place/{place}")
    public ResponseEntity<List<EventDto>> findEventsByPlace(@PathVariable String place) {
        return ResponseEntity.ok(eventService.findEventsByPlace(place));
    }

    /**
     * Поиск событий по жанру (публично доступно)
     */
    @Operation(summary = "Поиск событий по жанру")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список событий найден по жанру"),
            @ApiResponse(responseCode = "404", description = "События не найдены")
    })
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