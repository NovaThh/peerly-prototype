package com.peerly.server.request;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.peerly.server.request.entity.Request;

@Repository
public interface RequestRepository extends JpaRepository<Request, UUID> {

}