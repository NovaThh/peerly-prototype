package com.peerly.server.security;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.peerly.server.auth.CustomUserDetails;

class CustomUserDetailsTest {

  @Test
  void constructorAndGetters_WorkCorrectly() {
    // Arrange
    UUID id = UUID.randomUUID();
    String email = "test@example.com";
    String passwordHash = "hashedPassword";

    // Act
    CustomUserDetails userDetails = new CustomUserDetails(id, email, passwordHash);

    // Assert
    assertEquals(id, userDetails.getId());
    assertEquals(email, userDetails.getUsername());
    assertEquals(passwordHash, userDetails.getPassword());
    assertTrue(userDetails.isAccountNonExpired());
    assertTrue(userDetails.isAccountNonLocked());
    assertTrue(userDetails.isCredentialsNonExpired());
    assertTrue(userDetails.isEnabled());
    assertTrue(userDetails.getAuthorities().isEmpty());
  }
}