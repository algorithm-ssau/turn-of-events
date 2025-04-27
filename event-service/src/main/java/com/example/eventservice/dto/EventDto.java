package com.example.eventservice.dto;

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
    private Long id;
    
    @NotBlank(message = "Название события не может быть пустым")
    private String title;
    
    @NotBlank(message = "Дата события не может быть пустой")
    private String date;
    
    @NotBlank(message = "Время события не может быть пустым")
    private String time;
    
    private String price = "";
    
    @NotBlank(message = "Место проведения не может быть пустым")
    private String place;
    
    private String imageUrl = "";
    
    private String genre = "";
    
    private String duration = "";
    
    private String director = "";
    
    private String link = "";
    
    private String description = "";
} 