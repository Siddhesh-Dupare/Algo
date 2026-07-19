#pragma once

#include <SDL3/SDL.h>
#include <blend2d/blend2d.h>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>
#include <nlohmann/json.hpp>

#include "helper/Utils.h"
#include "connection/Socket.h"
#include "components/logpanel/LogPanel.h"
#include "imgui.h"
#include "imgui_impl_sdl3.h"
#include "imgui_impl_sdlrenderer3.h"

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

        Socket socket;
        LogPanel logPanel;
};
