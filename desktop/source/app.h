#pragma once

#include <SDL3/SDL.h>
#include <blend2d/blend2d.h>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>
#include <nlohmann/json.hpp>

#include "connection/Socket.h"
#include "components/Text.h"

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

        Socket socket;
        Text text;
};
