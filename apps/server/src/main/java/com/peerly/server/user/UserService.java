package com.peerly.server.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.peerly.server.user.dto.UpdateUserRequestDto;
import com.peerly.server.user.dto.UserRequestDto;
import com.peerly.server.user.dto.UserResponseDto;
import com.peerly.server.user.entity.User;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<UserResponseDto> getAllUsers() {
    return userRepository.findAll()
        .stream()
        .map(this::mapToResponseDto)
        .collect(Collectors.toList());
  }

  public UserResponseDto getUserById(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return mapToResponseDto(user);
  }

  public UserResponseDto createUser(UserRequestDto dto) {

    if (userRepository.existsByEmail(dto.getEmail())) {
      throw new RuntimeException("Email already in use");
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
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
      throw new RuntimeException("Email already in use");
    }
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setMajor(dto.getMajor());
    user.setEducationLevel(dto.getEducationLevel());
    // strength and needs help with are only received one value at a time according
    // to front end design
    if (null != dto.getStrengths()) {
      String updatedStrengths = appendValue(user.getStrengths(), dto.getStrengths());
      user.setStrengths(updatedStrengths);
    }

    if (null != dto.getNeedsHelpWith()) {
      String updatedNeeds = appendValue(user.getNeedsHelpWith(), dto.getNeedsHelpWith());
      user.setNeedsHelpWith(updatedNeeds);
    }

    user.setDescription(dto.getDescription());
    user.setProfileImageUrl(dto.getProfileImageUrl());

    User updateUser = userRepository.save(user);

    return mapToResponseDto(updateUser);
  }

  public void deleteUser(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
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