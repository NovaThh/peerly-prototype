package com.peerly.server.request;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;
import com.peerly.server.request.dto.UpdateRequestStatusDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestController {

  private final RequestService requestService;

  public RequestController(RequestService requestService) {
    this.requestService = requestService;
  }

  // POST /requests
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RequestResponseDto createRequest(@Valid @RequestBody CreateRequestDto dto) {
    return requestService.createRequest(dto);
  }

  // GET /requests
  // GET /requests?userId=...
  // GET /requests?requesterId=...
  // GET /requests?receiverId=...
  @GetMapping
  public List<RequestResponseDto> getRequests(
      @RequestParam(required = false) UUID userId,
      @RequestParam(required = false) UUID requesterId,
      @RequestParam(required = false) UUID receiverId) {

    if (null != userId) {
      return requestService.getRequestsByUserId(userId);
    }
    if (null != requesterId) {
      return requestService.getOutgoingRequests(requesterId);
    }
    if (null != receiverId) {
      return requestService.getIncomingRequests(receiverId);
    }

    return requestService.getAllRequests();
  }

  // GET /requests/{id}
  @GetMapping("/{id}")
  public RequestResponseDto getRequestById(@PathVariable UUID id) {
    return requestService.getRequestById(id);
  }

  @PatchMapping("{id}/status")
  public RequestResponseDto updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateRequestStatusDto dto) {
    return requestService.updateRequestStatus(id, dto.getStatus());
  }

  @DeleteMapping("/{id}")
  public void deleteRequest(@PathVariable UUID id) {
    requestService.deleteRequest(id);
  }
}