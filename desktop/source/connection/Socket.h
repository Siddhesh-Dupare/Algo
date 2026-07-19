#pragma once

#include <string>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>
#include <mutex>
#include <nlohmann/json.hpp>
#include <vector>
#include "../helper/Utils.h"

class Socket {
    public:
        Socket();
        ~Socket();

        bool webSocketInit();
        std::vector<nlohmann::json> drainTraceSteps();
        // void handleTraceSteps(const nlohmann::json& message);
    private:
        std::string webSocketUrl;
        ix::WebSocket webSocket;
        std::mutex traceMutex;

        std::vector<nlohmann::json> traceSteps;
};
