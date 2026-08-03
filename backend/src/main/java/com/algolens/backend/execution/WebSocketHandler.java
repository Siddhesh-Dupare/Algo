package com.algolens.backend.execution;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import tools.jackson.databind.ObjectMapper;

import com.algolens.backend.model.ExecutionRequest;
import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.execution.ExecutionService;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final ExecutionService executionService;

    public WebSocketHandler(ExecutionService executionService) {
        this.executionService = executionService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket connection establised with code " + session.getId());

        try {
            session.sendMessage(new TextMessage("Connection successful!"));
        } catch (Exception exception) {
            System.out.println("[BACKEND]: ERROR -> " + exception.getMessage());
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            ExecutionRequest request = mapper.readValue(message.getPayload(), ExecutionRequest.class);
            ExecutionResult result = executionService.execute(request);

            session.sendMessage(new TextMessage(mapper.writeValueAsString(result)));
        } catch (Exception exception) {
            System.out.println("[BACKEND]: ERROR -> " + exception.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("WebSocket connection closed");
    }
}
