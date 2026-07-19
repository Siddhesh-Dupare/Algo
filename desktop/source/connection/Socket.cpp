#include "Socket.h"
#include "SDL3/SDL_log.h"
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
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Failed to initialze network system");
        return false;
    }

    webSocket.setUrl(webSocketUrl);
    SDL_LogWarn(SDL_LOG_CATEGORY_APPLICATION, "Waiting for connection to %s", webSocketUrl.c_str());

    // NOTE: Real data parsing of incoming message in the callback
    webSocket.setOnMessageCallback([this](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message) {
            try {
                auto parsed = nlohmann::json::parse(msg->str);
                std::lock_guard<std::mutex> lock(traceMutex);
                traceSteps.push_back(parsed);
            } catch (const std::exception& exception) {
                SDL_LogWarn(SDL_LOG_CATEGORY_APPLICATION, "Invalid JSON message: %s", exception.what());
            }
        }
        else if (msg->type == ix::WebSocketMessageType::Open) {
            SDL_LogInfo(SDL_LOG_CATEGORY_APPLICATION, "Connected to %s", webSocketUrl.c_str());
            nlohmann::json reg = {{ "type", "register"}, { "role", "desktop" }};
            webSocket.send(reg.dump());
        }
        // NOTE: Keep retrying on connection error
        else if (msg->type == ix::WebSocketMessageType::Error) {
            SDL_LogWarn(SDL_LOG_CATEGORY_APPLICATION, "Connection error, retrying...");
        }
        else if (msg->type == ix::WebSocketMessageType::Close) {
            SDL_LogWarn(SDL_LOG_CATEGORY_APPLICATION, "Disconnected from %s", webSocketUrl.c_str());
        }
    });

    webSocket.start();
    return true;
}

std::vector<nlohmann::json> Socket::drainTraceSteps() {
    std::vector<nlohmann::json> steps;
    std::lock_guard<std::mutex> lock(traceMutex);
    steps.swap(traceSteps);
    return steps;
}

// void Socket::handleTraceSteps(const nlohmann::json& message) {
//     std::string type = message.value("type", "");
//     if (type == "trace-step") {
//         auto s = message.value("step", nlohmann::json::object());
//         int line = s.value("line", -1);
//         std::string event = s.value("event", "");
//         SDL_Log("[trace-step] line=%d, event=%s", line, event.c_str());
//     }
//     else if (type == "trace-complete") {
//         SDL_Log("[trace] complete");
//     } else if (type == "trace-error") {
//         SDL_Log("[trace] error: %s", message.value("message", "").c_str());
//     }
// }
