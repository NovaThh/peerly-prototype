package com.peerly.server.user.entity;

import java.time.Instant;
import java.util.UUID;

import com.peerly.server.user.EducationLevel;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @Email
  @NotBlank
  @Column(nullable = false, unique = true)
  private String email;

  @NotBlank
  @Column(nullable = false)
  private String passwordHash;

  @NotBlank
  @Column(nullable = false)
  private String major;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EducationLevel educationLevel;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String strengths;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String needsHelpWith;

  @Column(columnDefinition = "TEXT")
  private String description;

  private Integer tokenBalance = 2;

  private Instant createdAt = Instant.now();

  private String profileImageUrl;

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPasswordHash() {
    return passwordHash;
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

  public void setName(String name) {
    this.name = name;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public void setMajor(String major) {
    this.major = major;
  }

  public void setEducationLevel(EducationLevel educationLevel) {
    this.educationLevel = educationLevel;
  }

  public void setStrengths(String strengths) {
    this.strengths = strengths;
  }

  public void setNeedsHelpWith(String needsHelpWith) {
    this.needsHelpWith = needsHelpWith;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setProfileImageUrl(String profileImageUrl) {
    this.profileImageUrl = profileImageUrl;
  }
}