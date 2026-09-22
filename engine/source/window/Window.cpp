#include "Window.h"
#include <format>

#include <stdexcept>

Window::Window(const char* title, int width, int height) {
    m_window = SDL_CreateWindow(
        title, width, height, SDL_WINDOW_RESIZABLE
    );

    if (!m_window)
        throw std::runtime_error(
            std::format("[SDL] Window Creation Failed: {}", SDL_GetError())
        );
}

Window::~Window() {
    SDL_DestroyWindow(m_window);
}

Window::Window(Window&& other) noexcept
    : m_window{other.m_window} {
        other.m_window = nullptr;
}

Window& Window::operator=(Window&& other) noexcept {
    if (this != &other) {
        SDL_DestroyWindow(m_window);

        m_window = other.m_window;
        other.m_window = nullptr;
    }

    return *this;
}

SDL_Window* Window::get() const noexcept {
    return m_window;
}
