#include "App.h"

#include <stdexcept>
#include <format>

App::App()
    : m_sdl(),
      m_window("AlgoLens", m_width, m_height),
      m_renderer(m_window.get()),
      m_texture(m_renderer.get(), m_width, m_height) {}

App::~App() = default;

void App::run() {
    while (is_running) {
        processEvents();
        render();
    }
}

void App::handleResize(int width, int height) {
    if (m_width == width && m_height == height)
        return;

    m_width = width;
    m_height = height;

    if (!m_texture.resize(width, height)) {
        throw std::runtime_error(
            std::format("[SDL] Failed to resize the window {}", SDL_GetError())
        );
    }
}

void App::processEvents() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_EVENT_QUIT)
            is_running = false;
        else if (event.type == SDL_EVENT_WINDOW_RESIZED) {
            handleResize(
                event.window.data1, event.window.data2
            );
        }
    }
}

void App::render() {
    SDL_RenderClear(m_renderer.get());

    SDL_RenderPresent(m_renderer.get());
}
