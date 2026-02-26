package com.peerly.server.session.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import com.peerly.server.request.entity.Request;

@Entity
@Table(name = "study_sessions")
public class StudySession {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne
  @JoinColumn(name = "request_id", nullable = false, unique = true)
  private Request request;

  private LocalDateTime scheduledDatetime;

  private Instant completedAt;

  @Column(nullable = false)
  private boolean requesterCompleted = false;

  @Column(nullable = false)
  private boolean receiverCompleted = false;

  private Instant createdAt = Instant.now();

  // getters and setters
}