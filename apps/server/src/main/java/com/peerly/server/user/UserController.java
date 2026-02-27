package com.peerly.server.user;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.peerly.server.user.dto.UpdateUserRequestDto;
import com.peerly.server.user.dto.UserRequestDto;
import com.peerly.server.user.dto.UserResponseDto;

import jakarta.validation.Valid;

@RestController
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/users")
  public List<UserResponseDto> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/users/{id}")
  public UserResponseDto getUserById(@PathVariable UUID id) {
    return userService.getUserById(id);
  }

  @PostMapping("/user")
  @ResponseStatus(HttpStatus.CREATED)
  public UserResponseDto createUser(@Valid @RequestBody UserRequestDto dto) {
    return userService.createUser(dto);
  }

  @PutMapping("/users/{id}")
  public UserResponseDto updateUser(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateUserRequestDto dto) {

    return userService.updateUser(id, dto);
  }

  @DeleteMapping("/users/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUserById(@PathVariable UUID id) {
    userService.deleteUser(id);
  }
}