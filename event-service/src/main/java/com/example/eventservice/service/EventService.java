package com.example.eventservice.service;

import com.example.eventservice.model.Event;
import com.example.eventservice.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return repository.findById(id);
    }

    public Event createEvent(Event event) {
        return repository.save(event);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return repository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDate(updatedEvent.getDate());
            event.setTime(updatedEvent.getTime());
            event.setPrice(updatedEvent.getPrice());
            event.setPlace(updatedEvent.getPlace());
            event.setImageUrl(updatedEvent.getImageUrl());
            event.setGenre(updatedEvent.getGenre());
            event.setDuration(updatedEvent.getDuration());
            event.setDirector(updatedEvent.getDirector());
            event.setLink(updatedEvent.getLink());
            event.setDescription(updatedEvent.getDescription());
            return repository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public void deleteEvent(Long id) {
        repository.deleteById(id);
    }
}
