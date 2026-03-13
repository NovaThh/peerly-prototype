package com.peerly.server.session;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.peerly.server.request.RequestRepository;
import com.peerly.server.request.entity.Request;
import com.peerly.server.session.dto.StudySessionResponseDto;
import com.peerly.server.session.dto.UpdateStudySessionScheduleDto;
import com.peerly.server.session.entity.StudySession;

@Service
public class StudySessionService {

  private final StudySessionRepository studySessionRepository;
  private final RequestRepository requestRepository;

  public StudySessionService(
      StudySessionRepository studySessionRepository,
      RequestRepository requestRepository) {
    this.studySessionRepository = studySessionRepository;
    this.requestRepository = requestRepository;
  }

  public List<StudySessionResponseDto> getAllSessionsForUser(UUID currentUserId) {
    return studySessionRepository.findAll()
        .stream()
        .filter(session -> isParticipant(session, currentUserId))
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public StudySessionResponseDto getSessionByIdForUser(UUID sessionId, UUID currentUserId) {
    StudySession session = studySessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found"));

    assertParticipant(session, currentUserId);
    return mapToDto(session);
  }

  public StudySessionResponseDto getSessionByRequestId(UUID requestId, UUID currentUserId) {
    StudySession session = studySessionRepository.findByRequest_Id(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found for request"));

    assertParticipant(session, currentUserId);
    return mapToDto(session);
  }

  public StudySessionResponseDto createSessionForRequest(UUID requestId) {
    if (studySessionRepository.existsByRequest_Id(requestId)) {
      StudySession existing = studySessionRepository.findByRequest_Id(requestId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found for request"));
      return mapToDto(existing);
    }

    Request request = requestRepository.findById(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

    StudySession session = new StudySession();
    session.setRequest(request);
    session.setScheduledDatetime(null);

    StudySession saved = studySessionRepository.save(session);
    return mapToDto(saved);
  }

  public StudySessionResponseDto updateSchedule(
      UUID requestId,
      UpdateStudySessionScheduleDto dto,
      UUID currentUserId) {
    StudySession session = studySessionRepository.findByRequest_Id(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found for request"));

    assertParticipant(session, currentUserId);
    session.setScheduledDatetime(dto.getScheduledDatetime());

    StudySession saved = studySessionRepository.save(session);
    return mapToDto(saved);
  }

  public void deleteSession(UUID sessionId, UUID currentUserId) {
    StudySession session = studySessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found"));

    assertParticipant(session, currentUserId);
    studySessionRepository.delete(session);
  }

  public void deleteSessionByRequestId(UUID requestId) {
    studySessionRepository.deleteByRequest_Id(requestId);
  }

  private void assertParticipant(StudySession session, UUID currentUserId) {
    if (!isParticipant(session, currentUserId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this study session");
    }
  }

  private boolean isParticipant(StudySession session, UUID currentUserId) {
    UUID requesterId = session.getRequest().getRequester().getId();
    UUID receiverId = session.getRequest().getReceiver().getId();

    return requesterId.equals(currentUserId) || receiverId.equals(currentUserId);
  }

  private StudySessionResponseDto mapToDto(StudySession s) {
    return new StudySessionResponseDto(
        s.getId(),
        s.getRequest().getId(),
        s.getScheduledDatetime(),
        s.getCompletedAt(),
        s.isRequesterCompleted(),
        s.isReceiverCompleted(),
        s.getCreatedAt());
  }
}