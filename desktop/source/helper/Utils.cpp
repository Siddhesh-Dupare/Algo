#include <SDL3/SDL.h>
#include "Utils.h"

std::string getBasePath() {
    return SDL_GetBasePath();
}

int getWindowWidth() {
    return WIDTH;
}

int getWindowHeight() {
    return HEIGHT;
}
