package com.peerly.server.session;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.peerly.server.request.RequestRepository;
import com.peerly.server.request.entity.Request;
import com.peerly.server.session.dto.StudySessionResponseDto;
import com.peerly.server.session.dto.UpdateStudySessionScheduleDto;
import com.peerly.server.session.entity.StudySession;

@Service
public class StudySessionService {

  private final StudySessionRepository studySessionRepository;
  private final RequestRepository requestRepository;

  public StudySessionService(StudySessionRepository studySessionRepository,
      RequestRepository requestRepository) {
    this.studySessionRepository = studySessionRepository;
    this.requestRepository = requestRepository;
  }

  // READ all (debug/admin)
  public List<StudySessionResponseDto> getAllSessions() {
    return studySessionRepository.findAll()
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  // READ by session id
  public StudySessionResponseDto getSessionById(UUID sessionId) {
    StudySession session = studySessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Study session not found"));
    return mapToDto(session);
  }

  // READ by request id (important for frontend)
  public StudySessionResponseDto getSessionByRequestId(UUID requestId) {
    StudySession session = studySessionRepository.findByRequest_Id(requestId)
        .orElseThrow(() -> new RuntimeException("Study session not found for request"));
    return mapToDto(session);
  }

  // CREATE session for request (used automatically when request becomes ACCEPTED)
  public StudySessionResponseDto createSessionForRequest(UUID requestId) {

    if (studySessionRepository.existsByRequest_Id(requestId)) {
      // session already exists; return existing
      return getSessionByRequestId(requestId);
    }

    Request request = requestRepository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Request not found"));

    StudySession session = new StudySession();
    session.setRequest(request);
    session.setScheduledDatetime(null);

    StudySession saved = studySessionRepository.save(session);
    return mapToDto(saved);
  }

  // UPDATE schedule
  public StudySessionResponseDto updateSchedule(UUID requestId, UpdateStudySessionScheduleDto dto) {
    StudySession session = studySessionRepository.findByRequest_Id(requestId)
        .orElseThrow(() -> new RuntimeException("Study session not found for request"));

    session.setScheduledDatetime(dto.getScheduledDatetime());
    StudySession saved = studySessionRepository.save(session);

    return mapToDto(saved);
  }

  // DELETE by session id
  public void deleteSession(UUID sessionId) {
    StudySession session = studySessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Study session not found"));
    studySessionRepository.delete(session);
  }

  // DELETE by request id (used automatically when request is canceled)
  public void deleteSessionByRequestId(UUID requestId) {
    studySessionRepository.deleteByRequest_Id(requestId);
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