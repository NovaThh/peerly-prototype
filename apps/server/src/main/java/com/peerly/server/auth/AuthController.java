package com.peerly.server.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.peerly.server.auth.dto.AuthResponseDto;
import com.peerly.server.auth.dto.LoginRequestDto;
import com.peerly.server.user.UserRepository;
import com.peerly.server.user.entity.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;

  public AuthController(
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      UserRepository userRepository) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
  }

  @PostMapping("/login")
  public AuthResponseDto login(@Valid @RequestBody LoginRequestDto dto) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
    } catch (BadCredentialsException ex) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    User user = userRepository.findByEmail(dto.getEmail())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

    CustomUserDetails userDetails = new CustomUserDetails(user.getId(), user.getEmail(), user.getPasswordHash());
    String token = jwtService.generateToken(userDetails);

    return new AuthResponseDto(token, user.getId(), user.getName(), user.getEmail());
  }
}