
package com.algolens.backend.execution;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;

import com.algolens.backend.model.ExecutionRequest;
import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.execution.ExecutionService;

@Service
public class MessageDispatcher {
    private final ObjectMapper mapper;
    private final ExecutionService service;

    public MessageDispatcher(ExecutionService service, ObjectMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    public void dispatch(WebSocketSession session, ExecutionRequest request) throws Exception {
        switch (request.getType()) {
            case "EXECUTE" -> handleRun(session, request);
            default -> throw new IllegalArgumentException("Unsupported request type: " + request.getType());
        }
    }

    public void handleRun(WebSocketSession session, ExecutionRequest request) throws Exception {
        ExecutionResult result = service.execute(request);
        session.sendMessage(new TextMessage(mapper.writeValueAsString(result)));
    }
}
