package com.peerly.server.session.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

public class StudySessionResponseDto {

  private UUID id;
  private UUID requestId;
  private LocalDateTime scheduledDatetime;
  private Instant completedAt;
  private boolean requesterCompleted;
  private boolean receiverCompleted;
  private Instant createdAt;

  public StudySessionResponseDto(
      UUID id,
      UUID requestId,
      LocalDateTime scheduledDatetime,
      Instant completedAt,
      boolean requesterCompleted,
      boolean receiverCompleted,
      Instant createdAt) {

    this.id = id;
    this.requestId = requestId;
    this.scheduledDatetime = scheduledDatetime;
    this.completedAt = completedAt;
    this.requesterCompleted = requesterCompleted;
    this.receiverCompleted = receiverCompleted;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public UUID getRequestId() {
    return requestId;
  }

  public LocalDateTime getScheduledDatetime() {
    return scheduledDatetime;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  public boolean isRequesterCompleted() {
    return requesterCompleted;
  }

  public boolean isReceiverCompleted() {
    return receiverCompleted;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}