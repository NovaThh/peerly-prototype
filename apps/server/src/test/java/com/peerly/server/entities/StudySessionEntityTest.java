package com.peerly.server.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

import com.peerly.server.request.RequestStatus;
import com.peerly.server.request.RequestType;
import com.peerly.server.request.entity.Request;
import com.peerly.server.session.entity.StudySession;
import com.peerly.server.user.EducationLevel;
import com.peerly.server.user.entity.User;

class StudySessionEntityTest {

  @Test
  void defaultValues_areInitialized() {
    StudySession session = new StudySession();

    assertFalse(session.isRequesterCompleted());
    assertFalse(session.isReceiverCompleted());
    assertNotNull(session.getCreatedAt());
    assertNull(session.getCompletedAt());
    assertNull(session.getScheduledDatetime());
  }

  @Test
  void settersAndGetters_workCorrectly() {
    Request request = buildRequest();
    LocalDateTime scheduled = LocalDateTime.of(2026, 3, 25, 16, 0);
    Instant completedAt = Instant.parse("2026-03-25T17:00:00Z");

    StudySession session = new StudySession();
    session.setRequest(request);
    session.setScheduledDatetime(scheduled);
    session.setCompletedAt(completedAt);
    session.setRequesterCompleted(true);
    session.setReceiverCompleted(false);

    assertEquals(request, session.getRequest());
    assertEquals(scheduled, session.getScheduledDatetime());
    assertEquals(completedAt, session.getCompletedAt());
    assertTrue(session.isRequesterCompleted());
    assertFalse(session.isReceiverCompleted());
  }

  private Request buildRequest() {
    User requester = new User();
    requester.setName("Alice");
    requester.setEmail("alice@example.com");
    requester.setPasswordHash("hashed");
    requester.setMajor("Computer Science");
    requester.setEducationLevel(EducationLevel.HBO);
    requester.setStrengths("Java");
    requester.setNeedsHelpWith("Math");

    User receiver = new User();
    receiver.setName("Bob");
    receiver.setEmail("bob@example.com");
    receiver.setPasswordHash("hashed");
    receiver.setMajor("Software Engineering");
    receiver.setEducationLevel(EducationLevel.WO);
    receiver.setStrengths("Spring");
    receiver.setNeedsHelpWith("Physics");

    Request request = new Request();
    request.setRequester(requester);
    request.setReceiver(receiver);
    request.setSubject("Study together");
    request.setType(RequestType.REQUEST);
    request.setStatus(RequestStatus.ACCEPTED);

    return request;
  }
}