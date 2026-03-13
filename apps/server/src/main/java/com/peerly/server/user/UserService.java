package com.peerly.server.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.peerly.server.user.dto.UpdateUserRequestDto;
import com.peerly.server.user.dto.UserRequestDto;
import com.peerly.server.user.dto.UserResponseDto;
import com.peerly.server.user.entity.User;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<UserResponseDto> getAllUsers() {
    return userRepository.findAll()
        .stream()
        .map(this::mapToResponseDto)
        .collect(Collectors.toList());
  }

  public UserResponseDto getUserById(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    return mapToResponseDto(user);
  }

  public UUID getUserIdByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
        .getId();
  }

  public UserResponseDto createUser(UserRequestDto dto) {
    if (userRepository.existsByEmail(dto.getEmail())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    User user = new User();
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
    user.setMajor(dto.getMajor());
    user.setEducationLevel(dto.getEducationLevel());
    user.setStrengths(dto.getStrengths());
    user.setNeedsHelpWith(dto.getNeedsHelpWith());
    user.setDescription(dto.getDescription());
    user.setProfileImageUrl(dto.getProfileImageUrl());

    User savedUser = userRepository.save(user);
    return mapToResponseDto(savedUser);
  }

  public UserResponseDto updateUser(UUID id, UpdateUserRequestDto dto) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setMajor(dto.getMajor());
    user.setEducationLevel(dto.getEducationLevel());

    if (dto.getStrengths() != null) {
      user.setStrengths(appendValue(user.getStrengths(), dto.getStrengths()));
    }

    if (dto.getNeedsHelpWith() != null) {
      user.setNeedsHelpWith(appendValue(user.getNeedsHelpWith(), dto.getNeedsHelpWith()));
    }

    user.setDescription(dto.getDescription());
    user.setProfileImageUrl(dto.getProfileImageUrl());

    User updatedUser = userRepository.save(user);
    return mapToResponseDto(updatedUser);
  }

  public void deleteUser(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    userRepository.delete(user);
  }

  private UserResponseDto mapToResponseDto(User user) {
    return new UserResponseDto(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getMajor(),
        user.getEducationLevel(),
        user.getStrengths(),
        user.getNeedsHelpWith(),
        user.getDescription(),
        user.getTokenBalance(),
        user.getCreatedAt(),
        user.getProfileImageUrl());
  }

  private String appendValue(String current, String newValue) {
    if (current == null || current.isBlank()) {
      return newValue;
    }

    List<String> values = List.of(current.split("\\s*,\\s*"));

    if (values.contains(newValue)) {
      return current;
    }

    return current + ", " + newValue;
  }
}