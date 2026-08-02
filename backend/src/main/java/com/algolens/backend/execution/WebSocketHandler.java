package com.algolens.backend.execution;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

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
        System.out.println("Received message: " + message.getPayload());

        try {
            session.sendMessage(new TextMessage("Hello from backend " + message.getPayload()));
        } catch (Exception exception) {
            System.out.println("[BACKEND]: ERROR -> " + exception.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("WebSocket connection closed");
    }
}
