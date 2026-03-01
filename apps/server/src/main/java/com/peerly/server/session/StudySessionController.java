package com.peerly.server.session;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.session.dto.StudySessionResponseDto;

@RestController
@RequestMapping("/sessions")
public class StudySessionController {

  private final StudySessionService studySessionService;

  public StudySessionController(StudySessionService studySessionService) {
    this.studySessionService = studySessionService;
  }

  // GET /sessions (debug/admin)
  @GetMapping
  public List<StudySessionResponseDto> getAllSessions() {
    return studySessionService.getAllSessions();
  }

  // GET /sessions/{sessionId} (debug/admin)
  @GetMapping("/{sessionId}")
  public StudySessionResponseDto getSessionById(@PathVariable UUID sessionId) {
    return studySessionService.getSessionById(sessionId);
  }

  // DELETE /sessions/{sessionId} (debug/admin)
  @DeleteMapping("/{sessionId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteSession(@PathVariable UUID sessionId) {
    studySessionService.deleteSession(sessionId);
  }
}