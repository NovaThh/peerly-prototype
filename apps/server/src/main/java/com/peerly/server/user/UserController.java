package com.peerly.server.user;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @GetMapping("/test")
  public String test() {
    return "Backend working";
  }
}