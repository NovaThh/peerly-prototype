package com.peerly.server.security;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.peerly.server.auth.CustomUserDetails;
import com.peerly.server.auth.JwtService;

@SpringBootTest
@TestPropertySource(properties = {
    "jwt.secret=mySecretKeyForTestingPurposesOnly12345678901234567890",
    "jwt.expiration-ms=3600000"
})
class JwtServiceTest {

  @Autowired
  private JwtService jwtService;

  @Test
  void generateToken_ValidUserDetails_ReturnsToken() {
    // Arrange
    UUID userId = UUID.randomUUID();
    CustomUserDetails userDetails = new CustomUserDetails(userId, "test@example.com", "password");

    // Act
    String token = jwtService.generateToken(userDetails);

    // Assert
    assertNotNull(token);
    assertTrue(token.length() > 0);
  }

  @Test
  void extractUsername_ValidToken_ReturnsUsername() {
    // Arrange
    UUID userId = UUID.randomUUID();
    CustomUserDetails userDetails = new CustomUserDetails(userId, "test@example.com", "password");
    String token = jwtService.generateToken(userDetails);

    // Act
    String username = jwtService.extractUsername(token);

    // Assert
    assertEquals("test@example.com", username);
  }

  @Test
  void isTokenValid_ValidToken_ReturnsTrue() {
    // Arrange
    UUID userId = UUID.randomUUID();
    CustomUserDetails userDetails = new CustomUserDetails(userId, "test@example.com", "password");
    String token = jwtService.generateToken(userDetails);

    // Act
    boolean isValid = jwtService.isTokenValid(token, userDetails);

    // Assert
    assertTrue(isValid);
  }

  @Test
  void isTokenValid_InvalidUsername_ReturnsFalse() {
    // Arrange
    UUID userId = UUID.randomUUID();
    CustomUserDetails userDetails = new CustomUserDetails(userId, "test@example.com", "password");
    String token = jwtService.generateToken(userDetails);

    CustomUserDetails wrongUser = new CustomUserDetails(userId, "wrong@example.com", "password");

    // Act
    boolean isValid = jwtService.isTokenValid(token, wrongUser);

    // Assert
    assertFalse(isValid);
  }
}