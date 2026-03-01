package com.peerly.server.request;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;
import com.peerly.server.request.dto.UpdateRequestStatusDto;
import com.peerly.server.session.StudySessionService;
import com.peerly.server.session.dto.StudySessionResponseDto;
import com.peerly.server.session.dto.UpdateStudySessionScheduleDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestController {

  private final RequestService requestService;
  private final StudySessionService studySessionService;

  public RequestController(RequestService requestService, StudySessionService studySessionService) {
    this.requestService = requestService;
    this.studySessionService = studySessionService;
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

  // PATCH /requests/{id}/status
  @PatchMapping("/{id}/status")
  public RequestResponseDto updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateRequestStatusDto dto) {
    return requestService.updateRequestStatus(id, dto.getStatus());
  }

  // DELETE /requests/{id}
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequest(@PathVariable UUID id) {
    requestService.deleteRequest(id);
  }

  // StudySession sub-resource
  // GET /requests/{requestId}/session
  @GetMapping("/{requestId}/session")
  public StudySessionResponseDto getSessionForRequest(@PathVariable UUID requestId) {
    return studySessionService.getSessionByRequestId(requestId);
  }

  // PATCH /requests/{requestId}/session/schedule
  @PatchMapping("/{requestId}/session/schedule")
  public StudySessionResponseDto updateSessionSchedule(
      @PathVariable UUID requestId,
      @Valid @RequestBody UpdateStudySessionScheduleDto dto) {

    return studySessionService.updateSchedule(requestId, dto);
  }
}