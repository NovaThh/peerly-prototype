package com.peerly.server.user;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import com.peerly.server.user.entity.User;

@DataJpaTest
class UserRepositoryTest {

  @Autowired
  private UserRepository userRepository;

  @Test
  void findByEmail_returnsUserWhenExists() {
    User user = new User();
    user.setName("Alice");
    user.setEmail("alice@example.com");
    user.setPasswordHash("hashed");
    user.setMajor("Computer Science");
    user.setEducationLevel(EducationLevel.HBO);
    user.setStrengths("Java");
    user.setNeedsHelpWith("Math");
    user.setDescription("Repo test");

    userRepository.save(user);

    Optional<User> found = userRepository.findByEmail("alice@example.com");

    assertTrue(found.isPresent());
    assertEquals("Alice", found.get().getName());
  }

  @Test
  void existsByEmail_returnsTrueWhenExists() {
    User user = new User();
    user.setName("Bob");
    user.setEmail("bob@example.com");
    user.setPasswordHash("hashed");
    user.setMajor("Software Engineering");
    user.setEducationLevel(EducationLevel.WO);
    user.setStrengths("Spring");
    user.setNeedsHelpWith("Physics");

    userRepository.save(user);

    assertTrue(userRepository.existsByEmail("bob@example.com"));
    assertFalse(userRepository.existsByEmail("missing@example.com"));
  }
}