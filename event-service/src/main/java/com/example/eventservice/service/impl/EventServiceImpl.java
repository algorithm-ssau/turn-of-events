package com.example.eventservice.service.impl;

import com.example.eventservice.dto.EventDto;
import com.example.eventservice.exception.ResourceNotFoundException;
import com.example.eventservice.model.Event;
import com.example.eventservice.repository.EventRepository;
import com.example.eventservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional
    public EventDto createEvent(EventDto eventDto) {
        Event event = mapToEntity(eventDto);
        Event savedEvent = eventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Событие с id " + id + " не найдено"));
        return mapToDto(event);
    }

    @Override
    public List<EventDto> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<EventDto> getEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findAll(pageable);
        return events.map(this::mapToDto);
    }

    @Override
    @Transactional
    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Событие с id " + id + " не найдено"));
        
        // Обновляем данные события
        event.setTitle(eventDto.getTitle());
        event.setDate(eventDto.getDate());
        event.setTime(eventDto.getTime());
        event.setPlace(eventDto.getPlace());
        event.setPrice(eventDto.getPrice());
        event.setImageUrl(eventDto.getImageUrl());
        event.setGenre(eventDto.getGenre());
        event.setDuration(eventDto.getDuration());
        event.setDirector(eventDto.getDirector());
        event.setLink(eventDto.getLink());
        event.setDescription(eventDto.getDescription());
        
        Event updatedEvent = eventRepository.save(event);
        return mapToDto(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Событие с id " + id + " не найдено"));
        eventRepository.delete(event);
    }

    @Override
    public List<EventDto> searchEventsByTitle(String title) {
        List<Event> events = eventRepository.findByTitleContainingIgnoreCase(title);
        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> findEventsByPlace(String place) {
        List<Event> events = eventRepository.findByPlace(place);
        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> findEventsByGenre(String genre) {
        List<Event> events = eventRepository.findByGenre(genre);
        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> findEventsByUserId(Long userId) {
        List<Event> events = eventRepository.findByUserId(userId);
        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Маппинг из DTO в Entity
    private Event mapToEntity(EventDto eventDto) {
        return Event.builder()
                .title(eventDto.getTitle())
                .date(eventDto.getDate())
                .time(eventDto.getTime())
                .price(eventDto.getPrice())
                .place(eventDto.getPlace())
                .imageUrl(eventDto.getImageUrl())
                .genre(eventDto.getGenre())
                .duration(eventDto.getDuration())
                .director(eventDto.getDirector())
                .link(eventDto.getLink())
                .description(eventDto.getDescription())
                .userId(eventDto.getUserId())
                .build();
    }

    // Маппинг из Entity в DTO
    private EventDto mapToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .time(event.getTime())
                .price(event.getPrice())
                .place(event.getPlace())
                .imageUrl(event.getImageUrl())
                .genre(event.getGenre())
                .duration(event.getDuration())
                .director(event.getDirector())
                .link(event.getLink())
                .description(event.getDescription())
                .userId(event.getUserId())
                .build();
    }
}