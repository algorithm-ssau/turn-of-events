package com.service;

import com.dto.EventDto;
import com.model.Event;
import com.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с событиями. Реализует бизнес-логику.
 */
@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getDateTime(), event.getLocation(), event.getCategory()))
                .collect(Collectors.toList());
    }

    public EventDto createEvent(EventDto eventDto) {
        Event event = new Event(null, eventDto.getTitle(), eventDto.getDescription(), eventDto.getDateTime(), eventDto.getLocation(), eventDto.getCategory());
        Event savedEvent = eventRepository.save(event);
        return new EventDto(savedEvent.getId(), savedEvent.getTitle(), savedEvent.getDescription(), savedEvent.getDateTime(), savedEvent.getLocation(), savedEvent.getCategory());
    }
}
