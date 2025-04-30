package com.example.eventservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String date;
    
    @Column(nullable = false)
    private String time;
    
    private String price;
    
    @Column(nullable = false)
    private String place;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    private String genre;
    
    private String duration;
    
    private String director;
    
    private String link;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 