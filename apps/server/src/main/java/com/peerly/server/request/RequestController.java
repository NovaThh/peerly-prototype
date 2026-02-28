package com.peerly.server.request;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestController {

  private final RequestService requestService;

  public RequestController(RequestService requestService) {
    this.requestService = requestService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RequestResponseDto createRequest(
      @Valid @RequestBody CreateRequestDto dto) {

    return requestService.createRequest(dto);
  }
}