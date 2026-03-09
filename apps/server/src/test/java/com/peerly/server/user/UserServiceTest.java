package com.peerly.server.user;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.peerly.server.user.dto.UpdateUserRequestDto;
import com.peerly.server.user.dto.UserRequestDto;
import com.peerly.server.user.dto.UserResponseDto;
import com.peerly.server.user.entity.User;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  private UserService userService;

  @BeforeEach
  void setUp() {
    userService = new UserService(userRepository);
  }

  @Test
  void getAllUsers_returnsMappedUsers() {
    User user = buildUser();
    when(userRepository.findAll()).thenReturn(List.of(user));

    List<UserResponseDto> result = userService.getAllUsers();

    assertEquals(1, result.size());
    assertEquals("Alice", result.get(0).getName());
    assertEquals("alice@example.com", result.get(0).getEmail());
    verify(userRepository).findAll();
  }

  @Test
  void getUserById_returnsUserWhenFound() {
    UUID id = UUID.randomUUID();
    User user = buildUser();
    when(userRepository.findById(id)).thenReturn(Optional.of(user));

    UserResponseDto result = userService.getUserById(id);

    assertEquals("Alice", result.getName());
    assertEquals("Computer Science", result.getMajor());
    verify(userRepository).findById(id);
  }

  @Test
  void getUserById_throwsWhenNotFound() {
    UUID id = UUID.randomUUID();
    when(userRepository.findById(id)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.getUserById(id));

    assertEquals("User not found", ex.getMessage());
    verify(userRepository).findById(id);
  }

  @Test
  void createUser_savesUserAndHashesPassword() {
    UserRequestDto dto = new UserRequestDto();
    dto.setName("Alice");
    dto.setEmail("alice@example.com");
    dto.setPassword("plainPassword123");
    dto.setMajor("Computer Science");
    dto.setEducationLevel(EducationLevel.HBO);
    dto.setStrengths("Java");
    dto.setNeedsHelpWith("Math");
    dto.setDescription("Test description");
    dto.setProfileImageUrl("https://example.com/avatar.jpg");

    when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    UserResponseDto result = userService.createUser(dto);

    ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(captor.capture());

    User savedUser = captor.getValue();
    assertEquals("Alice", savedUser.getName());
    assertEquals("alice@example.com", savedUser.getEmail());
    assertNotEquals("plainPassword123", savedUser.getPasswordHash());
    assertTrue(new BCryptPasswordEncoder().matches("plainPassword123", savedUser.getPasswordHash()));

    assertEquals("Alice", result.getName());
    assertEquals("alice@example.com", result.getEmail());
    assertEquals("Java", result.getStrengths());
    assertEquals("Math", result.getNeedsHelpWith());
  }

  @Test
  void createUser_throwsWhenEmailAlreadyExists() {
    UserRequestDto dto = new UserRequestDto();
    dto.setEmail("alice@example.com");

    when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.createUser(dto));

    assertEquals("Email already in use", ex.getMessage());
    verify(userRepository, never()).save(any());
  }

  @Test
  void updateUser_updatesBasicFieldsAndAppendsNewStrengthsAndNeeds() {
    UUID id = UUID.randomUUID();

    User existingUser = buildUser();
    when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
    when(userRepository.existsByEmail("alice.new@example.com")).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    UpdateUserRequestDto dto = buildUpdateDto(
        "Alice Updated",
        "alice.new@example.com",
        "Software Engineering",
        EducationLevel.WO,
        "Spring",
        "Physics",
        "Updated description",
        "https://example.com/new.jpg");

    UserResponseDto result = userService.updateUser(id, dto);

    assertEquals("Alice Updated", result.getName());
    assertEquals("alice.new@example.com", result.getEmail());
    assertEquals("Software Engineering", result.getMajor());
    assertEquals(EducationLevel.WO, result.getEducationLevel());
    assertEquals("Java, Spring", result.getStrengths());
    assertEquals("Math, Physics", result.getNeedsHelpWith());
    assertEquals("Updated description", result.getDescription());
    assertEquals("https://example.com/new.jpg", result.getProfileImageUrl());
  }

  @Test
  void updateUser_doesNotDuplicateStrengthOrNeed() {
    UUID id = UUID.randomUUID();

    User existingUser = buildUser();
    when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    UpdateUserRequestDto dto = buildUpdateDto(
        "Alice",
        "alice@example.com",
        "Computer Science",
        EducationLevel.HBO,
        "Java",
        "Math",
        "Same values",
        null);

    UserResponseDto result = userService.updateUser(id, dto);

    assertEquals("Java", result.getStrengths());
    assertEquals("Math", result.getNeedsHelpWith());
    verify(userRepository, never()).existsByEmail(any());
  }

  @Test
  void updateUser_throwsWhenUserNotFound() {
    UUID id = UUID.randomUUID();
    when(userRepository.findById(id)).thenReturn(Optional.empty());

    UpdateUserRequestDto dto = buildUpdateDto(
        "Alice",
        "alice@example.com",
        "Computer Science",
        EducationLevel.HBO,
        "Java",
        "Math",
        null,
        null);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.updateUser(id, dto));

    assertEquals("User not found", ex.getMessage());
  }

  @Test
  void updateUser_throwsWhenNewEmailAlreadyInUse() {
    UUID id = UUID.randomUUID();

    User existingUser = buildUser();
    when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
    when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

    UpdateUserRequestDto dto = buildUpdateDto(
        "Alice",
        "taken@example.com",
        "Computer Science",
        EducationLevel.HBO,
        "Java",
        "Math",
        null,
        null);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.updateUser(id, dto));

    assertEquals("Email already in use", ex.getMessage());
    verify(userRepository, never()).save(any());
  }

  @Test
  void deleteUser_deletesWhenFound() {
    UUID id = UUID.randomUUID();
    User user = buildUser();
    when(userRepository.findById(id)).thenReturn(Optional.of(user));

    userService.deleteUser(id);

    verify(userRepository).delete(user);
  }

  @Test
  void deleteUser_throwsWhenNotFound() {
    UUID id = UUID.randomUUID();
    when(userRepository.findById(id)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.deleteUser(id));

    assertEquals("User not found", ex.getMessage());
    verify(userRepository, never()).delete(any());
  }

  private User buildUser() {
    User user = new User();
    user.setName("Alice");
    user.setEmail("alice@example.com");
    user.setPasswordHash("hashed");
    user.setMajor("Computer Science");
    user.setEducationLevel(EducationLevel.HBO);
    user.setStrengths("Java");
    user.setNeedsHelpWith("Math");
    user.setDescription("Initial description");
    user.setProfileImageUrl("https://example.com/avatar.jpg");
    return user;
  }

  private UpdateUserRequestDto buildUpdateDto(
      String name,
      String email,
      String major,
      EducationLevel educationLevel,
      String strengths,
      String needsHelpWith,
      String description,
      String profileImageUrl) {
    UpdateUserRequestDto dto = new UpdateUserRequestDto();
    setField(dto, "name", name);
    setField(dto, "email", email);
    setField(dto, "major", major);
    setField(dto, "educationLevel", educationLevel);
    setField(dto, "strengths", strengths);
    setField(dto, "needsHelpWith", needsHelpWith);
    setField(dto, "description", description);
    setField(dto, "profileImageUrl", profileImageUrl);
    return dto;
  }

  private void setField(Object target, String fieldName, Object value) {
    try {
      var field = target.getClass().getDeclaredField(fieldName);
      field.setAccessible(true);
      field.set(target, value);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}