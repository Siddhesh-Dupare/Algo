#include "source/App.h"

int main() {
    try {
        App app;
        app.run();
    } catch (const std::exception& e) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "%s", e.what());
    }

    return 0;
}
