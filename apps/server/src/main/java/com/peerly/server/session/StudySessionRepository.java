package com.peerly.server.session;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.peerly.server.session.entity.StudySession;

import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {

  Optional<StudySession> findByRequest_Id(UUID requestId);

  boolean existsByRequest_Id(UUID requestId);

  @Modifying
  @Transactional
  void deleteByRequest_Id(UUID requestId);
}