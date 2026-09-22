#pragma once

#include "window/Window.h"

class App {
public:
    App();
    ~App();

    void run();
private:
    Window m_window;
    bool is_running { true };
};
