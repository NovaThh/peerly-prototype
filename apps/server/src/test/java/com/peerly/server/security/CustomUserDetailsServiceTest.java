package com.peerly.server.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.peerly.server.auth.CustomUserDetails;
import com.peerly.server.auth.CustomUserDetailsService;
import com.peerly.server.user.UserRepository;
import com.peerly.server.user.entity.User;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private CustomUserDetailsService customUserDetailsService;

  @Test
  void loadUserByUsername_UserExists_ReturnsCustomUserDetails() {
    // Arrange
    UUID userId = UUID.randomUUID();
    User user = new User();
    user.setId(userId);
    user.setEmail("test@example.com");
    user.setPasswordHash("hashedPassword");

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

    // Act
    CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername("test@example.com");

    // Assert
    assertNotNull(userDetails);
    assertEquals(userId, userDetails.getId());
    assertEquals("test@example.com", userDetails.getUsername());
    assertEquals("hashedPassword", userDetails.getPassword());
  }

  @Test
  void loadUserByUsername_UserNotFound_ThrowsUsernameNotFoundException() {
    // Arrange
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

    // Act & Assert
    UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class,
        () -> customUserDetailsService.loadUserByUsername("test@example.com"));
    assertEquals("User not found", exception.getMessage());
  }
}