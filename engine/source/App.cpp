#include "App.h"

App::App()
    : m_window("AlgoLens", 1200, 700) {
        SDL_Log("Window Initiated");
}

App::~App() = default;

// void App::run() {
//     while (is_running) {
//         // event handling
//         // rendering
//     }
// }
