package com.peerly.server.request;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;
import com.peerly.server.request.dto.UpdateRequestStatusDto;
import com.peerly.server.session.StudySessionService;
import com.peerly.server.session.dto.StudySessionResponseDto;
import com.peerly.server.session.dto.UpdateStudySessionScheduleDto;
import com.peerly.server.user.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestController {

  private final RequestService requestService;
  private final StudySessionService studySessionService;
  private final UserService userService;

  public RequestController(
      RequestService requestService,
      StudySessionService studySessionService,
      UserService userService) {
    this.requestService = requestService;
    this.studySessionService = studySessionService;
    this.userService = userService;
  }

  private UUID getCurrentUserId(Authentication authentication) {
    return userService.getUserIdByEmail(authentication.getName());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RequestResponseDto createRequest(
      @Valid @RequestBody CreateRequestDto dto,
      Authentication authentication) {
    return requestService.createRequest(getCurrentUserId(authentication), dto);
  }

  @GetMapping
  public List<RequestResponseDto> getRequests(Authentication authentication) {
    return requestService.getRequestsByUserId(getCurrentUserId(authentication));
  }

  @GetMapping("/{id}")
  public RequestResponseDto getRequestById(@PathVariable UUID id, Authentication authentication) {
    return requestService.getRequestByIdForUser(id, getCurrentUserId(authentication));
  }

  @PatchMapping("/{id}/status")
  public RequestResponseDto updateStatus(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateRequestStatusDto dto,
      Authentication authentication) {
    return requestService.updateRequestStatus(id, dto.getStatus(), getCurrentUserId(authentication));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequest(@PathVariable UUID id, Authentication authentication) {
    requestService.deleteRequest(id, getCurrentUserId(authentication));
  }

  @GetMapping("/{requestId}/session")
  public StudySessionResponseDto getSessionForRequest(@PathVariable UUID requestId, Authentication authentication) {
    return studySessionService.getSessionByRequestId(requestId, getCurrentUserId(authentication));
  }

  @PatchMapping("/{requestId}/session/schedule")
  public StudySessionResponseDto updateSessionSchedule(
      @PathVariable UUID requestId,
      @Valid @RequestBody UpdateStudySessionScheduleDto dto,
      Authentication authentication) {
    return studySessionService.updateSchedule(requestId, dto, getCurrentUserId(authentication));
  }
}