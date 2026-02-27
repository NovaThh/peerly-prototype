package com.peerly.server.user.dto;

import com.peerly.server.user.EducationLevel;

import jakarta.validation.constraints.*;

//Incoming
public class UserRequestDto {
  @NotBlank
  @Size(min = 2, max = 50, message = "Name must have at least 2 characters")
  @Pattern(regexp = "^(?=.*[AEIOUaeiou])[A-Za-z]+( [A-Za-z]+)*$", message = "Name must contain only letters, single spaces between words, and at least one vowel")
  private String name;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;

  @NotBlank
  @Size(min = 2, max = 50)
  @Pattern(regexp = "^[A-Za-z ]+$", message = "Major can only contain letters and spaces")
  private String major;

  @NotNull
  private EducationLevel educationLevel;

  @Size(min = 2, max = 35)
  // even tho we store as varchar seperated by comma, front end only let user
  // sends one strength/needs help with at a time, hence this restriction
  @Pattern(regexp = "^[A-Za-z0-9 #+/]+$", message = "Only letters, numbers, spaces and # + / allowed")
  private String strengths;

  @NotBlank
  @Size(min = 2, max = 35)
  @Pattern(regexp = "^[A-Za-z0-9 #+/]+$", message = "Only letters, numbers, spaces and # + / allowed")
  private String needsHelpWith;

  private String description;

  private String profileImageUrl;

  // getters
  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
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

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  // setters (needed for JSON -> object binding)
  public void setName(String name) {
    this.name = name;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
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
