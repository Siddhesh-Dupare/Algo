#include "Renderer.h"

#include <format>

Renderer::Renderer(SDL_Window* m_window) {
    m_renderer = SDL_CreateRenderer(
        m_window, nullptr
    );

    SDL_Log("SDL_Renderer is working");

    if (!m_renderer) {
        throw std::runtime_error(
            std::format("[SDL_Renderer] Failed to create renderer: {}", SDL_GetError())
        );
    }

    if (!SDL_SetRenderVSync(m_renderer, 1)) {
        throw std::runtime_error(
            std::format("[SDL_Renderer] Failed to set VSync: {}", SDL_GetError())
        );
    }
}

Renderer::~Renderer() {
    SDL_DestroyRenderer(m_renderer);
}

Renderer::Renderer(Renderer&& other) noexcept
    : m_renderer{other.m_renderer} {
        other.m_renderer = nullptr;
}

Renderer& Renderer::operator=(Renderer&& other) noexcept {
    if (this != &other) {
        SDL_DestroyRenderer(m_renderer);

        m_renderer = other.m_renderer;
        other.m_renderer = nullptr;
    }

    return *this;
}

SDL_Renderer* Renderer::get() const noexcept {
    return m_renderer;
}
