#pragma once

#include "window/Window.h"
#include "renderer/Renderer.h"

class App {
public:
    App();
    ~App();

    void run();
private:
    Window m_window;
    Renderer m_renderer;
    bool is_running { true };
};
