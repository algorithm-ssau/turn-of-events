package com.example.eventservice.repository;

import com.example.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByPlace(String place);
    List<Event> findByGenre(String genre);
    List<Event> findByUserId(Long userId);
    List<Event> findTop10ByDateAfterOrderByDateAsc(String currentDate);
}