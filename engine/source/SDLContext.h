#pragma once

#include <SDL3/SDL.h>
#include <stdexcept>
#include <format>

class SDLContext {
public:
    SDLContext() {
        if (!SDL_Init(SDL_INIT_VIDEO)) {
            throw std::runtime_error(
                std::format("[SDLContext] Failed to initialize SDL {}", SDL_GetError())
            );
        }
    }

    ~SDLContext() {
        SDL_Quit();
    }

    SDLContext(const SDLContext&) = delete;
    SDLContext& operator=(const SDLContext&) = delete;
};
