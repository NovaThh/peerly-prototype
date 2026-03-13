package com.peerly.server.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.peerly.server.request.RequestStatus;
import com.peerly.server.request.RequestType;
import com.peerly.server.request.entity.Request;
import com.peerly.server.user.EducationLevel;
import com.peerly.server.user.entity.User;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class RequestEntityTest {

  private static Validator validator;

  @BeforeAll
  static void setUpValidator() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  void validRequest_hasNoValidationErrors() {
    Request request = buildValidRequest();

    Set<ConstraintViolation<Request>> violations = validator.validate(request);

    assertTrue(violations.isEmpty());
  }

  @Test
  void nullRequester_shouldFailValidation() {
    Request request = buildValidRequest();
    request.setRequester(null);

    Set<ConstraintViolation<Request>> violations = validator.validate(request);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "requester"));
  }

  @Test
  void nullReceiver_shouldFailValidation() {
    Request request = buildValidRequest();
    request.setReceiver(null);

    Set<ConstraintViolation<Request>> violations = validator.validate(request);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "receiver"));
  }

  @Test
  void blankSubject_shouldFailValidation() {
    Request request = buildValidRequest();
    request.setSubject(" ");

    Set<ConstraintViolation<Request>> violations = validator.validate(request);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "subject"));
  }

  @Test
  void nullType_shouldFailValidation() {
    Request request = buildValidRequest();
    request.setType(null);

    Set<ConstraintViolation<Request>> violations = validator.validate(request);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "type"));
  }

  @Test
  void defaultCreatedAt_isInitialized() {
    Request request = new Request();

    assertNotNull(request.getCreatedAt());
  }

  @Test
  void settersAndGetters_workCorrectly() {
    User requester = buildUser("requester@example.com");
    User receiver = buildUser("receiver@example.com");

    LocalDateTime scheduled = LocalDateTime.of(2026, 3, 20, 14, 30);

    Request request = new Request();
    request.setRequester(requester);
    request.setReceiver(receiver);
    request.setSubject("OOP tutoring");
    request.setType(RequestType.REQUEST);
    request.setScheduledDatetime(scheduled);
    request.setStatus(RequestStatus.PENDING);

    assertEquals(requester, request.getRequester());
    assertEquals(receiver, request.getReceiver());
    assertEquals("OOP tutoring", request.getSubject());
    assertEquals(RequestType.REQUEST, request.getType());
    assertEquals(scheduled, request.getScheduledDatetime());
    assertEquals(RequestStatus.PENDING, request.getStatus());
  }

  private Request buildValidRequest() {
    Request request = new Request();
    request.setRequester(buildUser("requester@example.com"));
    request.setReceiver(buildUser("receiver@example.com"));
    request.setSubject("Java help");
    request.setType(RequestType.REQUEST);
    request.setScheduledDatetime(LocalDateTime.of(2026, 3, 20, 10, 0));
    request.setStatus(RequestStatus.PENDING);
    return request;
  }

  private User buildUser(String email) {
    User user = new User();
    user.setName("Alice");
    user.setEmail(email);
    user.setPasswordHash("hashed-password");
    user.setMajor("Computer Science");
    user.setEducationLevel(EducationLevel.HBO);
    user.setStrengths("Java");
    user.setNeedsHelpWith("Math");
    return user;
  }

  private boolean hasViolationForField(Set<? extends ConstraintViolation<?>> violations, String fieldName) {
    return violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals(fieldName));
  }
}