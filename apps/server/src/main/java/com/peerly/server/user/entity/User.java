package com.peerly.server.user.entity;

import java.time.Instant;
import java.util.UUID;

import com.peerly.server.user.EducationLevel;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @Email
  @NotBlank
  @Column(nullable = false, unique = true)
  private String email;

  @NotBlank
  @Column(nullable = false)
  private String passwordHash;

  @NotBlank
  @Column(nullable = false)
  private String major;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EducationLevel educationLevel;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String strengths;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String needsHelpWith;

  @Column(columnDefinition = "TEXT")
  private String description;

  private Integer tokenBalance = 0;

  private Instant createdAt = Instant.now();

  private String profileImageUrl;
}