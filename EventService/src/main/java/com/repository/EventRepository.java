package com.repository;

import com.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Репозиторий для работы с сущностью Event. Использует Spring Data JPA.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
