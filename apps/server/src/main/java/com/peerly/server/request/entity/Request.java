package com.peerly.server.request.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import com.peerly.server.request.RequestStatus;
import com.peerly.server.request.RequestType;
import com.peerly.server.user.entity.User;

@Entity
@Table(name = "requests")
public class Request {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @NotNull
  @JoinColumn(name = "requester_id", nullable = false)
  private User requester;

  @ManyToOne
  @NotNull
  @JoinColumn(name = "receiver_id", nullable = false)
  private User receiver;

  @NotBlank
  private String subject;

  @Enumerated(EnumType.STRING)
  @NotNull
  private RequestType type;

  private LocalDateTime scheduledDatetime;

  @Enumerated(EnumType.STRING)
  private RequestStatus status;

  private Instant createdAt = Instant.now();

  // getters and setters
}