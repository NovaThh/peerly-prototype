package com.peerly.server.request;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.peerly.server.request.entity.Request;
import com.peerly.server.user.entity.User;

public interface RequestRepository extends JpaRepository<Request, UUID> {

  List<Request> findByRequester(User requester);

  List<Request> findByReceiver(User receiver);

}