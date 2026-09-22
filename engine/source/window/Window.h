#pragma once

#include <SDL3/SDL.h>

class Window {
public:
    Window(const char* title, int width, int height);
    ~Window();

    // NOTE: Disable the copy of object
    Window(const Window&) = delete;
    Window& operator=(const Window&) = delete;

    // NOTE: use r-value reference
    Window(Window&& other) noexcept;
    Window& operator=(Window&& other) noexcept;

    SDL_Window* get() const noexcept;

private:
    SDL_Window* m_window { nullptr };
};
