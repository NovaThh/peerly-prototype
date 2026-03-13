package com.peerly.server.request;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;
import com.peerly.server.request.entity.Request;
import com.peerly.server.session.StudySessionService;
import com.peerly.server.user.UserRepository;
import com.peerly.server.user.entity.User;

@Service
public class RequestService {

  private final RequestRepository requestRepository;
  private final UserRepository userRepository;
  private final StudySessionService studySessionService;

  public RequestService(
      RequestRepository requestRepository,
      UserRepository userRepository,
      StudySessionService studySessionService) {
    this.requestRepository = requestRepository;
    this.userRepository = userRepository;
    this.studySessionService = studySessionService;
  }

  public RequestResponseDto createRequest(UUID currentUserId, CreateRequestDto dto) {
    User requester = userRepository.findById(currentUserId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requester not found"));

    User receiver = userRepository.findById(dto.getReceiverId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

    if (requester.getId().equals(receiver.getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a request to yourself");
    }

    Request request = new Request();
    request.setRequester(requester);
    request.setReceiver(receiver);
    request.setSubject(dto.getSubject());
    request.setType(dto.getType());
    request.setScheduledDatetime(dto.getScheduledDatetime());
    request.setStatus(RequestStatus.PENDING);

    Request saved = requestRepository.save(request);
    return mapToDto(saved);
  }

  public List<RequestResponseDto> getRequestsByUserId(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    return requestRepository.findByRequesterOrReceiver(user, user)
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public RequestResponseDto getRequestByIdForUser(UUID id, UUID currentUserId) {
    Request request = requestRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

    assertParticipant(request, currentUserId);
    return mapToDto(request);
  }

  @Transactional
  public RequestResponseDto updateRequestStatus(UUID requestId, RequestStatus newStatus, UUID currentUserId) {
    Request request = requestRepository.findById(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

    UUID requesterId = request.getRequester().getId();
    UUID receiverId = request.getReceiver().getId();

    if (currentUserId.equals(receiverId)) {
      if (newStatus != RequestStatus.ACCEPTED && newStatus != RequestStatus.DECLINED) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "Receiver can only ACCEPT or DECLINE a request");
      }
    } else if (currentUserId.equals(requesterId)) {
      if (newStatus != RequestStatus.CANCELED) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "Requester can only CANCEL a request");
      }
    } else {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this request");
    }

    RequestStatus oldStatus = request.getStatus();
    request.setStatus(newStatus);
    Request saved = requestRepository.save(request);

    if (oldStatus == RequestStatus.PENDING && newStatus == RequestStatus.ACCEPTED) {
      studySessionService.createSessionForRequest(requestId);
    }

    if (newStatus == RequestStatus.CANCELED || newStatus == RequestStatus.DECLINED) {
      studySessionService.deleteSessionByRequestId(requestId);
    }

    return mapToDto(saved);
  }

  public void deleteRequest(UUID id, UUID currentUserId) {
    Request request = requestRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

    assertParticipant(request, currentUserId);

    if (request.getStatus() != RequestStatus.CANCELED &&
        request.getStatus() != RequestStatus.DECLINED) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Only CANCELED or DECLINED requests can be deleted");
    }

    requestRepository.delete(request);
  }

  private void assertParticipant(Request request, UUID currentUserId) {
    boolean isParticipant = request.getRequester().getId().equals(currentUserId) ||
        request.getReceiver().getId().equals(currentUserId);

    if (!isParticipant) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this request");
    }
  }

  private RequestResponseDto mapToDto(Request request) {
    return new RequestResponseDto(
        request.getId(),
        request.getRequester().getId(),
        request.getReceiver().getId(),
        request.getSubject(),
        request.getType(),
        request.getScheduledDatetime(),
        request.getStatus(),
        request.getCreatedAt());
  }
}