package com.peerly.server.request.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.peerly.server.request.RequestType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateRequestDto {

  @NotNull
  private UUID receiverId;

  @NotBlank
  private String subject;

  @NotNull
  private RequestType type;

  private LocalDateTime scheduledDatetime;

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