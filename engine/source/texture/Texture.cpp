#include "Texture.h"

#include <stdexcept>
#include <format>

Texture::Texture(SDL_Renderer* renderer, int width, int height)
    : m_renderer{renderer} {
        resize(width, height);
}

Texture::~Texture() {
    SDL_DestroyTexture(m_texture);
}

Texture::Texture(Texture&& other) noexcept
    : m_texture{other.m_texture},
        m_renderer{other.m_renderer} {
            other.m_renderer = nullptr;
            other.m_texture = nullptr;
}

Texture& Texture::operator=(Texture&& other) noexcept {
    if (this != &other) {
        SDL_DestroyTexture(m_texture);

        m_renderer = other.m_renderer;
        m_texture = other.m_texture;

        other.m_renderer = nullptr;
        other.m_texture = nullptr;
    }

    return *this;
}

bool Texture::resize(int width, int height) {
    if (!m_renderer) return false;

    SDL_Texture* newTexture = SDL_CreateTexture(
        m_renderer,
        SDL_PIXELFORMAT_ARGB32,
        SDL_TEXTUREACCESS_STREAMING,
        width, height
    );

    if (!newTexture) {
        throw std::runtime_error(
            std::format("[SDL_Texture] Failed to create a new texture {}", SDL_GetError())
        );
        return false;
    }

    SDL_DestroyTexture(m_texture);
    m_texture = newTexture;

    return true;
}

SDL_Texture* Texture::get() const noexcept {
    return m_texture;
}
