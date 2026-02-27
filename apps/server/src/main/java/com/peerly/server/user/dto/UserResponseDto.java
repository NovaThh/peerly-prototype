package com.peerly.server.user.dto;

import java.time.Instant;
import java.util.UUID;

import com.peerly.server.user.EducationLevel;

//Outgoing
public class UserResponseDto {

  private UUID id;
  private String name;
  private String email;
  private String major;
  private EducationLevel educationLevel;
  private String strengths;
  private String needsHelpWith;
  private String description;
  private Integer tokenBalance;
  private Instant createdAt;
  private String profileImageUrl;

  // constructor
  public UserResponseDto(UUID id, String name, String email, String major,
      EducationLevel educationLevel,
      String strengths,
      String needsHelpWith,
      String description,
      Integer tokenBalance,
      Instant createdAt,
      String profileImageUrl) {

    this.id = id;
    this.name = name;
    this.email = email;
    this.major = major;
    this.educationLevel = educationLevel;
    this.strengths = strengths;
    this.needsHelpWith = needsHelpWith;
    this.description = description;
    this.tokenBalance = tokenBalance;
    this.createdAt = createdAt;
    this.profileImageUrl = profileImageUrl;
  }

  // getters only
  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getMajor() {
    return major;
  }

  public EducationLevel getEducationLevel() {
    return educationLevel;
  }

  public String getStrengths() {
    return strengths;
  }

  public String getNeedsHelpWith() {
    return needsHelpWith;
  }

  public String getDescription() {
    return description;
  }

  public Integer getTokenBalance() {
    return tokenBalance;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }
}