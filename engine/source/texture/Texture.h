#pragma once

#include <SDL3/SDL.h>

class Texture {
public:
    Texture() = default;

    Texture(SDL_Renderer* renderer, int width, int height);
    ~Texture();

    // NOTE: Disable l-value reference
    Texture(const Texture&) = delete;
    Texture& operator=(const Texture&) = delete;

    // NOTE: Allow moving references
    Texture(Texture&& other) noexcept;
    Texture& operator=(Texture&& other) noexcept;

    bool resize(int width, int height);

    SDL_Texture* get() const noexcept;

private:
    SDL_Renderer* m_renderer { nullptr };
    SDL_Texture* m_texture { nullptr };
};
