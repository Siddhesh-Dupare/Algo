#include "source/App.h"

int main() {
    SDL_Init(SDL_INIT_VIDEO);

    {
        App app;
    }

    SDL_Quit();

    return 0;
}
