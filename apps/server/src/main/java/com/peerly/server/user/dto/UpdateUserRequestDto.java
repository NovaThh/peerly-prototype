package com.peerly.server.user.dto;

import com.peerly.server.user.EducationLevel;

import jakarta.validation.constraints.*;

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

  public String getMajor() {
    return major;
  }

  public String getEmail() {
    return email;
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
}
