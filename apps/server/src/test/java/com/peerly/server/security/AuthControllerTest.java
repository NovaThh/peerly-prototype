package com.peerly.server.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;

import com.peerly.server.auth.AuthController;
import com.peerly.server.auth.JwtService;
import com.peerly.server.auth.dto.AuthResponseDto;
import com.peerly.server.auth.dto.LoginRequestDto;
import com.peerly.server.user.UserRepository;
import com.peerly.server.user.entity.User;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private JwtService jwtService;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private AuthController authController;

  @Test
  void login_ValidCredentials_ReturnsAuthResponse() {
    // Arrange
    LoginRequestDto dto = new LoginRequestDto();
    dto.setEmail("test@example.com");
    dto.setPassword("password");

    UUID userId = UUID.randomUUID();
    User user = new User();
    user.setId(userId);
    user.setEmail("test@example.com");
    user.setPasswordHash("hashedPassword");
    user.setName("Test User");

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
    when(jwtService.generateToken(any())).thenReturn("jwtToken");

    // Act
    AuthResponseDto response = authController.login(dto);

    // Assert
    assertNotNull(response);
    assertEquals("jwtToken", response.getToken());
    assertEquals(userId, response.getUserId());
    assertEquals("Test User", response.getName());
    assertEquals("test@example.com", response.getEmail());
    verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    verify(jwtService).generateToken(any());
  }

  @Test
  void login_InvalidCredentials_ThrowsUnauthorized() {
    // Arrange
    LoginRequestDto dto = new LoginRequestDto();
    dto.setEmail("test@example.com");
    dto.setPassword("wrongpassword");

    doThrow(new BadCredentialsException("Invalid")).when(authenticationManager)
        .authenticate(any(UsernamePasswordAuthenticationToken.class));

    // Act & Assert
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authController.login(dto));
    assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    assertEquals("Invalid email or password", exception.getReason());
  }

  @Test
  void login_UserNotFound_ThrowsUnauthorized() {
    // Arrange
    LoginRequestDto dto = new LoginRequestDto();
    dto.setEmail("test@example.com");
    dto.setPassword("password");

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

    // Act & Assert
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authController.login(dto));
    assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    assertEquals("Invalid email or password", exception.getReason());
  }
}