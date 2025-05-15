package com.example.eventservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    @Schema(description = "ID события", example = "1")
    private Long id;
    
    @Schema(description = "Название события", example = "Театральная постановка")
    @NotBlank(message = "Название события не может быть пустым")
    private String title;
    
    @Schema(description = "Дата события", example = "2025-05-15")
    @NotBlank(message = "Дата события не может быть пустой")
    private String date;
    
    @Schema(description = "Время события", example = "19:00")
    @NotBlank(message = "Время события не может быть пустым")
    private String time;
    
    @Schema(description = "Цена билета", example = "500")
    @Builder.Default
    private String price = "";
    
    @Schema(description = "Место проведения", example = "Театр драмы")
    @NotBlank(message = "Место проведения не может быть пустым")
    private String place;
    
    @Schema(description = "URL изображения афиши", example = "https://example.com/image.jpg")
    @Builder.Default
    private String imageUrl = "";
    
    @Schema(description = "Жанр события", example = "Драма")
    @Builder.Default
    private String genre = "";
    
    @Schema(description = "Длительность события", example = "2 часа")
    @Builder.Default
    private String duration = "";
    
    @Schema(description = "Режиссёр события", example = "Иван Иванов")
    @Builder.Default
    private String director = "";
    
    @Schema(description = "Ссылка на событие", example = "https://example.com/event")
    @Builder.Default
    private String link = "";
    
    @Schema(description = "Описание события", example = "Описание театральной постановки...")
    @Builder.Default
    private String description = "";
    
    @Schema(description = "ID пользователя, создавшего событие", example = "10")
    private Long userId;
}