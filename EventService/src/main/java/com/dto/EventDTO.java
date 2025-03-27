package com.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) для передачи данных о событиях между слоями приложения.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private String category;
}
