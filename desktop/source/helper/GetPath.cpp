#include <SDL3/SDL.h>
#include "GetPath.h"

std::string getBasePath() {
    return SDL_GetBasePath();
}
