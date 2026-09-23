#include "App.h"

App::App()
    : m_window("AlgoLens", 1200, 700),
        m_renderer(m_window.get()) {
        SDL_Log("Window Initiated");
}

App::~App() = default;

void App::run() {
    SDL_Event event;
    while (is_running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT)
                is_running = false;
        }

        SDL_RenderClear(m_renderer.get());

        SDL_RenderPresent(m_renderer.get());
    }
}
