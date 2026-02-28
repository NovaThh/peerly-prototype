package com.peerly.server.request.dto;

import com.peerly.server.request.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateRequestStatusDto {

  @NotNull
  private RequestStatus status;

  public RequestStatus getStatus() {
    return status;
  }

  public void setStatus(RequestStatus status) {
    this.status = status;
  }
}