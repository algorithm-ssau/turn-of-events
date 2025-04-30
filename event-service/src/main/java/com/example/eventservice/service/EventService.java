package com.example.eventservice.service;

import com.example.eventservice.dto.EventDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {
    EventDto createEvent(EventDto eventDto);
    EventDto getEventById(Long id);
    List<EventDto> getAllEvents();
    Page<EventDto> getEvents(Pageable pageable);
    EventDto updateEvent(Long id, EventDto eventDto);
    void deleteEvent(Long id);
    List<EventDto> searchEventsByTitle(String title);
    List<EventDto> findEventsByPlace(String place);
    List<EventDto> findEventsByGenre(String genre);
} 