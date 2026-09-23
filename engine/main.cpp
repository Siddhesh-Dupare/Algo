#include "source/App.h"

#include <stdexcept>
#include <format>

int main() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(
            std::format("[SDL] Failed to initialize: {}", SDL_GetError())
        );
    }

    try {
        App app;
        app.run();
    } catch (const std::exception& e) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "%s", e.what());
    }

    SDL_Quit();

    return 0;
}
