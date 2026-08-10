#pragma once

#include <SDL3/SDL.h>
#include <blend2d/blend2d.h>
#include "imgui.h"
#include "imgui_impl_sdl3.h"
#include "imgui_impl_sdlrenderer3.h"
#include <nlohmann/json.hpp>

class App {
    public:
        App();
        ~App();

        bool init();
        void run();
        void shutdown();
    private:

        SDL_Window* window;
        SDL_Renderer* renderer;
        SDL_Texture* texture;
        BLImage image;
        bool isRunning;

        const int WIDTH = 1200;
        const int HEIGHT = 800;
};
