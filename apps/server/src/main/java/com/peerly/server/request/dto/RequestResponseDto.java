package com.peerly.server.request.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import com.peerly.server.request.RequestStatus;
import com.peerly.server.request.RequestType;

public class RequestResponseDto {

  private UUID id;
  private UUID requesterId;
  private UUID receiverId;
  private String subject;
  private RequestType type;
  private LocalDateTime scheduledDatetime;
  private RequestStatus status;
  private Instant createdAt;

  public RequestResponseDto(
      UUID id,
      UUID requesterId,
      UUID receiverId,
      String subject,
      RequestType type,
      LocalDateTime scheduledDatetime,
      RequestStatus status,
      Instant createdAt) {

    this.id = id;
    this.requesterId = requesterId;
    this.receiverId = receiverId;
    this.subject = subject;
    this.type = type;
    this.scheduledDatetime = scheduledDatetime;
    this.status = status;
    this.createdAt = createdAt;
  }

  // getters
  public UUID getId() {
    return id;
  }

  public UUID getRequesterId() {
    return requesterId;
  }

  public UUID getReceiverId() {
    return receiverId;
  }

  public String getSubject() {
    return subject;
  }

  public RequestType getType() {
    return type;
  }

  public LocalDateTime getScheduledDatetime() {
    return scheduledDatetime;
  }

  public RequestStatus getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}