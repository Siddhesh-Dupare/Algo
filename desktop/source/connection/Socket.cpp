#include "Socket.h"
#include <SDL3/SDL.h>
#include <mutex>
#include <nlohmann/json.hpp>

Socket::Socket()
    : webSocketUrl("ws://localhost:3001") {
}

Socket::~Socket() {
    webSocket.stop();
    ix::uninitNetSystem();
}

bool Socket::webSocketInit() {
    if (!ix::initNetSystem()) {
        SDL_Log("Failed to initialze network system");
        return false;
    }

    webSocket.setUrl(webSocketUrl);
    // TODO: Draw the connection message
    SDL_Log("Connected to %s", webSocketUrl.c_str());

    webSocket.setOnMessageCallback([this](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message) {
            try {
                auto parsed = nlohmann::json::parse(msg->str);
                std::lock_guard<std::mutex> lock(traceMutex);
                traceSteps.push_back(parsed);
                // SDL_Log("Received in desktop: %s", parsed.dump().c_str());
            } catch (const std::exception& exception) {
                SDL_Log("Invalid JSON message: %s", exception.what());
            }
        }
        else if (msg->type == ix::WebSocketMessageType::Open) {
            nlohmann::json reg = {{ "type", "register"}, { "role", "desktop" }};
            webSocket.send(reg.dump());
        }
    });

    webSocket.start();
    return true;
}

void Socket::drainTraceSteps() {
    std::vector<nlohmann::json> steps;
    {
        std::lock_guard<std::mutex> lock(traceMutex);
        steps.swap(traceSteps);
    }
    for (const auto& step : steps) {
        handleTraceSteps(step);
    }
}

void Socket::handleTraceSteps(const nlohmann::json& message) {
    std::string type = message.value("type", "");
    if (type == "trace-step") {
        auto s = message.value("step", nlohmann::json::object());
        int line = s.value("line", -1);
        std::string event = s.value("event", "");
        SDL_Log("[trace-step] line=%d, event=%s", line, event.c_str());
    }
    else if (type == "trace-complete") {
        SDL_Log("[trace] complete");
    } else if (type == "trace-error") {
        SDL_Log("[trace] error: %s", message.value("message", "").c_str());
    }
}
