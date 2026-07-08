#include "app.h"

app::app() : window{nullptr}, running{false}, WIDTH{900}, HEIGHT{700} {}

app::~app() {
    shutdown();
}

void app::shutdown() {
    if (window)
        SDL_DestroyWindow(window);
    SDL_Quit();
}

bool app::init() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL_INIT Failed: %s", SDL_GetError());
        return false;
    }

    // NOTE: SDL Window
    window = SDL_CreateWindow("AlgoLens", WIDTH, HEIGHT, SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE);
    if (!window) {
        SDL_Log("Window creation failed: %s", SDL_GetError());
        return false;
    }

    running = true;
    return true;
}

void app::run() {
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT)
                running = false;
        }
    }
}
