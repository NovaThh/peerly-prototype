package com.peerly.server.session;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.peerly.server.session.entity.StudySession;
import com.peerly.server.request.entity.Request;

public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {

  Optional<StudySession> findByRequest(Request request);

}