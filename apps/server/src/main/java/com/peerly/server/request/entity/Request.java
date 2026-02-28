package com.peerly.server.request.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;

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

  public UUID getId() {
    return id;
  }

  public User getRequester() {
    return requester;
  }

  public User getReceiver() {
    return receiver;
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

  // setters
  public void setReceiver(User receiver) {
    this.receiver = receiver;
  }

  public void setRequester(User requester) {
    this.requester = requester;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public void setType(RequestType type) {
    this.type = type;
  }

  public void setScheduledDatetime(LocalDateTime scheduledDatetime) {
    this.scheduledDatetime = scheduledDatetime;
  }

  public void setStatus(RequestStatus status) {
    this.status = status;
  }
}