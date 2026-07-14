#pragma once

#include <SDL3/SDL.h>
#include <blend2d/blend2d.h>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>
#include <mutex>
#include <deque>
#include <nlohmann/json.hpp>
#include <string>

#include "connection/Socket.h"

class app {
    public:
        app();
        ~app();

        bool init();
        void run();
        void shutdown();

    private:
        SDL_Window* window;
        SDL_Renderer* renderer;
        BLImage image;
        SDL_Texture* texture;

        bool running;
        int WIDTH;
        int HEIGHT;

        std::vector<nlohmann::json> pendingTraceSteps;

        Socket socket;
};
