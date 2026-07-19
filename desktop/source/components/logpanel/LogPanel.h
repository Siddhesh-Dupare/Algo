#pragma once

#include <imgui.h>

class LogPanel {
    public:
        LogPanel();
        void draw(int windowWidth, int windowHeight);
    private:
        bool visible;
};
