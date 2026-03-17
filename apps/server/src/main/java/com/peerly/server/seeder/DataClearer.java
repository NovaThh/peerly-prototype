package com.peerly.server.seeder;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

import com.peerly.server.user.UserRepository;

public class DataClearer {

  public static void main(String[] args) {
    ApplicationContext context = SpringApplication.run(
        com.peerly.server.ServerApplication.class, args);

    UserRepository userRepository = context.getBean(UserRepository.class);

    try {
      System.out.println("Starting data clearing...");

      long userCount = userRepository.count();
      if (userCount > 0) {
        userRepository.deleteAll();
        System.out.println("✓ Deleted " + userCount + " user(s) from database.");
      } else {
        System.out.println("⊘ No users found in database.");
      }

      System.out.println("Data clearing complete!");
      System.exit(0);
    } catch (Exception e) {
      System.err.println("Error during clearing: " + e.getMessage());
      e.printStackTrace();
      System.exit(1);
    }
  }
}
