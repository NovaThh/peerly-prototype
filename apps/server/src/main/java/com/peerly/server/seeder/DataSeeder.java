package com.peerly.server.seeder;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

import com.peerly.server.user.UserRepository;
import com.peerly.server.user.dto.UserRequestDto;
import com.peerly.server.user.UserService;
import com.peerly.server.user.EducationLevel;

public class DataSeeder {

  private static final List<UserData> SEED_USERS = Arrays.asList(
      new UserData(
          "Alice Johnson",
          "alice@example.com",
          "password123",
          "Computer Science",
          EducationLevel.WO,
          "Programming, Math",
          "Physics",
          "Experienced in coding and algorithms."),
      new UserData(
          "Bob Smith",
          "bob@example.com",
          "password123",
          "Mathematics",
          EducationLevel.MASTER_WO,
          "Math, Statistics",
          "Programming",
          "Math enthusiast ready to help."),
      new UserData(
          "Charlie Brown",
          "charlie@example.com",
          "password123",
          "Physics",
          EducationLevel.HBO,
          "Physics, Chemistry",
          "English",
          "Science lover."),
      new UserData(
          "Diana Prince",
          "diana@example.com",
          "password123",
          "Engineering",
          EducationLevel.MASTER_HBO,
          "Engineering, Math",
          "History",
          "Engineer with a passion for teaching."),
      new UserData(
          "Eve Wilson",
          "eve@example.com",
          "password123",
          "Psychology",
          EducationLevel.WO,
          "Psychology, English",
          "Math",
          "Psychology student."));

  public static void main(String[] args) {
    ApplicationContext context = SpringApplication.run(
        com.peerly.server.ServerApplication.class, args);

    UserService userService = context.getBean(UserService.class);
    UserRepository userRepository = context.getBean(UserRepository.class);

    try {
      System.out.println("Starting data seeding...");

      int seedCount = 0;
      for (UserData userData : SEED_USERS) {
        if (!userRepository.existsByEmail(userData.getEmail())) {
          UserRequestDto dto = new UserRequestDto();
          dto.setName(userData.getName());
          dto.setEmail(userData.getEmail());
          dto.setPassword(userData.getPassword());
          dto.setMajor(userData.getMajor());
          dto.setEducationLevel(userData.getEducationLevel());
          dto.setStrengths(userData.getStrengths());
          dto.setNeedsHelpWith(userData.getNeedsHelpWith());
          dto.setDescription(userData.getDescription());
          dto.setProfileImageUrl(null);

          userService.createUser(dto);
          System.out.println("✓ Created user: " + userData.getEmail());
          seedCount++;
        } else {
          System.out.println("⊘ User already exists: " + userData.getEmail());
        }
      }

      System.out.println("\nSeeding complete! " + seedCount + " new users created.");
      System.exit(0);
    } catch (Exception e) {
      System.err.println("Error during seeding: " + e.getMessage());
      e.printStackTrace();
      System.exit(1);
    }
  }

  private static class UserData {
    private final String name;
    private final String email;
    private final String password;
    private final String major;
    private final EducationLevel educationLevel;
    private final String strengths;
    private final String needsHelpWith;
    private final String description;

    UserData(String name, String email, String password, String major, EducationLevel educationLevel,
        String strengths, String needsHelpWith, String description) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.major = major;
      this.educationLevel = educationLevel;
      this.strengths = strengths;
      this.needsHelpWith = needsHelpWith;
      this.description = description;
    }

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
  }
}
