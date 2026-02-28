package com.peerly.server.request;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.peerly.server.request.dto.CreateRequestDto;
import com.peerly.server.request.dto.RequestResponseDto;
import com.peerly.server.request.entity.Request;
import com.peerly.server.user.UserRepository;
import com.peerly.server.user.entity.User;

@Service
public class RequestService {

  private final RequestRepository requestRepository;
  private final UserRepository userRepository;

  public RequestService(RequestRepository requestRepository,
      UserRepository userRepository) {
    this.requestRepository = requestRepository;
    this.userRepository = userRepository;
  }

  public RequestResponseDto createRequest(CreateRequestDto dto) {

    User requester = userRepository.findById(dto.getRequesterId())
        .orElseThrow(() -> new RuntimeException("Requester not found"));

    User receiver = userRepository.findById(dto.getReceiverId())
        .orElseThrow(() -> new RuntimeException("Receiver not found"));

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

  public List<RequestResponseDto> getAllRequests() {
    return requestRepository.findAll()
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public RequestResponseDto getRequestById(UUID id) {
    Request request = requestRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Request not found"));

    return mapToDto(request);
  }

  public List<RequestResponseDto> getRequestsByUserId(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return requestRepository.findByRequesterOrReceiver(user, user)
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public List<RequestResponseDto> getOutgoingRequests(UUID requesterId) {
    User requester = userRepository.findById(requesterId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return requestRepository.findByRequester(requester)
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public List<RequestResponseDto> getIncomingRequests(UUID receiverId) {
    User receiver = userRepository.findById(receiverId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return requestRepository.findByReceiver(receiver)
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public RequestResponseDto updateRequestStatus(UUID requestId, RequestStatus newStatus) {

    Request request = requestRepository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Request not found"));

    // Simple prototype rule: allow any status change
    // (Later we’ll enforce valid transitions: PENDING->ACCEPTED/DECLINED, etc.) if
    // this prototype is chosen
    request.setStatus(newStatus);

    Request saved = requestRepository.save(request);
    return mapToDto(saved);
  }

  public void deleteRequest(UUID id) {
    Request request = requestRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Request not found"));
    if (request.getStatus() != RequestStatus.CANCELED &&
        request.getStatus() != RequestStatus.DECLINED) {

      throw new RuntimeException("Only CANCELED or DECLINED requests can be deleted");
    }
    requestRepository.delete(request);
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