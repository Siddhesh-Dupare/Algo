#pragma once

#include <SDL3/SDL.h>

class Renderer {
public:
    explicit Renderer(SDL_Window* m_window);
    ~Renderer();

    // NOTE: Disable the reference copy
    Renderer(const Renderer&) = delete;
    Renderer& operator=(const Renderer&) = delete;

    // NOTE: Explicit declaration of r-value reference
    Renderer(Renderer&& other) noexcept;
    Renderer& operator=(Renderer&& other) noexcept;

    SDL_Renderer* get() const noexcept;

private:
    SDL_Renderer* m_renderer { nullptr };
};
