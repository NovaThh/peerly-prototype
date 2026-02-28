package com.peerly.server.request;

import java.util.UUID;

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