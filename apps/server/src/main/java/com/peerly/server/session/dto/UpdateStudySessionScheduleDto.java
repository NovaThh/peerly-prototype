package com.peerly.server.session.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public class UpdateStudySessionScheduleDto {

  @NotNull
  private LocalDateTime scheduledDatetime;

  public LocalDateTime getScheduledDatetime() {
    return scheduledDatetime;
  }

  public void setScheduledDatetime(LocalDateTime scheduledDatetime) {
    this.scheduledDatetime = scheduledDatetime;
  }
}