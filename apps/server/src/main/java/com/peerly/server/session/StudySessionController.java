package com.peerly.server.session;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.session.dto.StudySessionResponseDto;
import com.peerly.server.user.UserService;

@RestController
@RequestMapping("/sessions")
public class StudySessionController {

  private final StudySessionService studySessionService;
  private final UserService userService;

  public StudySessionController(StudySessionService studySessionService, UserService userService) {
    this.studySessionService = studySessionService;
    this.userService = userService;
  }

  private UUID getCurrentUserId(Authentication authentication) {
    return userService.getUserIdByEmail(authentication.getName());
  }

  @GetMapping
  public List<StudySessionResponseDto> getMySessions(Authentication authentication) {
    return studySessionService.getAllSessionsForUser(getCurrentUserId(authentication));
  }

  @GetMapping("/{sessionId}")
  public StudySessionResponseDto getSessionById(@PathVariable UUID sessionId, Authentication authentication) {
    return studySessionService.getSessionByIdForUser(sessionId, getCurrentUserId(authentication));
  }

  @DeleteMapping("/{sessionId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteSession(@PathVariable UUID sessionId, Authentication authentication) {
    studySessionService.deleteSession(sessionId, getCurrentUserId(authentication));
  }
}