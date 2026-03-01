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

  // getters
  public UUID getId() {
    return id;
  }

  public Request getRequest() {
    return request;
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

  // setters
  public void setRequest(Request request) {
    this.request = request;
  }

  public void setScheduledDatetime(LocalDateTime scheduledDatetime) {
    this.scheduledDatetime = scheduledDatetime;
  }

  public void setCompletedAt(Instant completedAt) {
    this.completedAt = completedAt;
  }

  public void setRequesterCompleted(boolean requesterCompleted) {
    this.requesterCompleted = requesterCompleted;
  }

  public void setReceiverCompleted(boolean receiverCompleted) {
    this.receiverCompleted = receiverCompleted;
  }
}