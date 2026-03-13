package com.peerly.server.user.dto;

import com.peerly.server.user.EducationLevel;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUserRequestDto {

  @NotBlank
  @Size(min = 2, max = 50)
  @Pattern(regexp = "^(?=.*[AEIOUaeiou])[A-Za-z]+( [A-Za-z]+)*$")
  private String name;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  @Size(min = 2, max = 50)
  @Pattern(regexp = "^[A-Za-z ]+$")
  private String major;

  @NotNull
  private EducationLevel educationLevel;

  @Size(min = 2, max = 35)
  @Pattern(regexp = "^[A-Za-z0-9 #+/]+$")
  private String strengths;

  @NotBlank
  @Size(min = 2, max = 35)
  @Pattern(regexp = "^[A-Za-z0-9 #+/]+$")
  private String needsHelpWith;

  private String description;
  private String profileImageUrl;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getMajor() {
    return major;
  }

  public void setMajor(String major) {
    this.major = major;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public EducationLevel getEducationLevel() {
    return educationLevel;
  }

  public void setEducationLevel(EducationLevel educationLevel) {
    this.educationLevel = educationLevel;
  }

  public String getStrengths() {
    return strengths;
  }

  public void setStrengths(String strengths) {
    this.strengths = strengths;
  }

  public String getNeedsHelpWith() {
    return needsHelpWith;
  }

  public void setNeedsHelpWith(String needsHelpWith) {
    this.needsHelpWith = needsHelpWith;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public void setProfileImageUrl(String profileImageUrl) {
    this.profileImageUrl = profileImageUrl;
  }
}