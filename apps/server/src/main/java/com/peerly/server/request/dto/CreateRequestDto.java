package com.peerly.server.request.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.peerly.server.request.RequestType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateRequestDto {

  @NotNull
  private UUID requesterId;

  @NotNull
  private UUID receiverId;

  @NotBlank
  private String subject;

  @NotNull
  private RequestType type; // REQUEST or OFFER

  private LocalDateTime scheduledDatetime;

  // getters & setters
  public UUID getRequesterId() {
    return requesterId;
  }

  public void setRequesterId(UUID requesterId) {
    this.requesterId = requesterId;
  }

  public UUID getReceiverId() {
    return receiverId;
  }

  public void setReceiverId(UUID receiverId) {
    this.receiverId = receiverId;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public RequestType getType() {
    return type;
  }

  public void setType(RequestType type) {
    this.type = type;
  }

  public LocalDateTime getScheduledDatetime() {
    return scheduledDatetime;
  }

  public void setScheduledDatetime(LocalDateTime scheduledDatetime) {
    this.scheduledDatetime = scheduledDatetime;
  }
}