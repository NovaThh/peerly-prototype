package com.peerly.server.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.peerly.server.user.EducationLevel;
import com.peerly.server.user.entity.User;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class UserEntityTest {

  private static Validator validator;

  @BeforeAll
  static void setUpValidator() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  void validUser_hasNoValidationErrors() {
    User user = buildValidUser();

    Set<ConstraintViolation<User>> violations = validator.validate(user);

    assertTrue(violations.isEmpty());
  }

  @Test
  void blankName_shouldFailValidation() {
    User user = buildValidUser();
    user.setName(" ");

    Set<ConstraintViolation<User>> violations = validator.validate(user);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "name"));
  }

  @Test
  void invalidEmail_shouldFailValidation() {
    User user = buildValidUser();
    user.setEmail("not-an-email");

    Set<ConstraintViolation<User>> violations = validator.validate(user);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "email"));
  }

  @Test
  void nullEducationLevel_shouldFailValidation() {
    User user = buildValidUser();
    user.setEducationLevel(null);

    Set<ConstraintViolation<User>> violations = validator.validate(user);

    assertFalse(violations.isEmpty());
    assertTrue(hasViolationForField(violations, "educationLevel"));
  }

  @Test
  void defaultValues_areInitialized() {
    User user = new User();

    assertEquals(2, user.getTokenBalance());
    assertNotNull(user.getCreatedAt());
  }

  @Test
  void settersAndGetters_workCorrectly() {
    User user = new User();

    user.setName("Alice");
    user.setEmail("alice@example.com");
    user.setPasswordHash("hashed-password");
    user.setMajor("Computer Science");
    user.setEducationLevel(EducationLevel.HBO);
    user.setStrengths("Java");
    user.setNeedsHelpWith("Math");
    user.setDescription("Test description");
    user.setProfileImageUrl("https://example.com/alice.jpg");

    assertEquals("Alice", user.getName());
    assertEquals("alice@example.com", user.getEmail());
    assertEquals("hashed-password", user.getPasswordHash());
    assertEquals("Computer Science", user.getMajor());
    assertEquals(EducationLevel.HBO, user.getEducationLevel());
    assertEquals("Java", user.getStrengths());
    assertEquals("Math", user.getNeedsHelpWith());
    assertEquals("Test description", user.getDescription());
    assertEquals("https://example.com/alice.jpg", user.getProfileImageUrl());
  }

  private User buildValidUser() {
    User user = new User();
    user.setName("Alice");
    user.setEmail("alice@example.com");
    user.setPasswordHash("hashed-password");
    user.setMajor("Computer Science");
    user.setEducationLevel(EducationLevel.HBO);
    user.setStrengths("Java");
    user.setNeedsHelpWith("Math");
    user.setDescription("Test description");
    user.setProfileImageUrl("https://example.com/alice.jpg");
    return user;
  }

  private boolean hasViolationForField(Set<? extends ConstraintViolation<?>> violations, String fieldName) {
    return violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals(fieldName));
  }
}