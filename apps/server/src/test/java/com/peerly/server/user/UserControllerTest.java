package com.peerly.server.user;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.peerly.server.user.dto.UserResponseDto;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private UserService userService;

  @Test
  void getAllUsers_returnsOk() throws Exception {
    UserResponseDto user = buildResponseDto();

    when(userService.getAllUsers()).thenReturn(List.of(user));

    mockMvc.perform(get("/users"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Alice"))
        .andExpect(jsonPath("$[0].email").value("alice@example.com"))
        .andExpect(jsonPath("$[0].major").value("Computer Science"));
  }

  @Test
  void getUserById_returnsOk() throws Exception {
    UUID id = UUID.randomUUID();
    UserResponseDto user = buildResponseDto();

    when(userService.getUserById(id)).thenReturn(user);

    mockMvc.perform(get("/users/{id}", id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Alice"))
        .andExpect(jsonPath("$.educationLevel").value("HBO"));
  }

  @Test
  void createUser_returnsCreated() throws Exception {
    UserResponseDto user = buildResponseDto();

    when(userService.createUser(any())).thenReturn(user);

    String requestBody = """
        {
          "name": "Alice",
          "email": "alice@example.com",
          "password": "plainPassword123",
          "major": "Computer Science",
          "educationLevel": "HBO",
          "strengths": "Java",
          "needsHelpWith": "Math",
          "description": "Test description",
          "profileImageUrl": "https://example.com/avatar.jpg"
        }
        """;

    mockMvc.perform(post("/user")
        .contentType(APPLICATION_JSON)
        .content(requestBody))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name").value("Alice"))
        .andExpect(jsonPath("$.email").value("alice@example.com"));
  }

  @Test
  void createUser_returnsBadRequestWhenValidationFails() throws Exception {
    String invalidRequestBody = """
        {
          "name": "B",
          "email": "not-an-email",
          "password": "",
          "major": "123",
          "educationLevel": null,
          "strengths": "!",
          "needsHelpWith": ""
        }
        """;

    mockMvc.perform(post("/user")
        .contentType(APPLICATION_JSON)
        .content(invalidRequestBody))
        .andExpect(status().isBadRequest());
  }

  @Test
  void updateUser_returnsOk() throws Exception {
    UUID id = UUID.randomUUID();
    UserResponseDto user = new UserResponseDto(
        id,
        "Alice Updated",
        "alice.new@example.com",
        "Software Engineering",
        EducationLevel.WO,
        "Java, Spring",
        "Math, Physics",
        "Updated description",
        2,
        Instant.parse("2026-03-09T10:15:30Z"),
        "https://example.com/new.jpg");

    when(userService.updateUser(eq(id), any())).thenReturn(user);

    String requestBody = """
        {
          "name": "Alice Updated",
          "email": "alice.new@example.com",
          "major": "Software Engineering",
          "educationLevel": "WO",
          "strengths": "Spring",
          "needsHelpWith": "Physics",
          "description": "Updated description",
          "profileImageUrl": "https://example.com/new.jpg"
        }
        """;

    mockMvc.perform(put("/users/{id}", id)
        .contentType(APPLICATION_JSON)
        .content(requestBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Alice Updated"))
        .andExpect(jsonPath("$.strengths").value("Java, Spring"))
        .andExpect(jsonPath("$.needsHelpWith").value("Math, Physics"));
  }

  @Test
  void deleteUser_returnsNoContent() throws Exception {
    UUID id = UUID.randomUUID();

    mockMvc.perform(delete("/users/{id}", id))
        .andExpect(status().isNoContent());
  }

  private UserResponseDto buildResponseDto() {
    return new UserResponseDto(
        UUID.randomUUID(),
        "Alice",
        "alice@example.com",
        "Computer Science",
        EducationLevel.HBO,
        "Java",
        "Math",
        "Test description",
        2,
        Instant.parse("2026-03-09T10:15:30Z"),
        "https://example.com/avatar.jpg");
  }
}