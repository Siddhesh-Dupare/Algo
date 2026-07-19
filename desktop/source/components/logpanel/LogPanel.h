#pragma once

#include <imgui.h>
#include <SDL3/SDL.h>
#include <string>
#include <vector>
#include <mutex>

class LogPanel {
    public:
        LogPanel();
        void draw(int windowWidth, int windowHeight);
        void installLogCapture();

    private:
        bool visible;
        std::mutex logMutex;
        std::vector<std::string> logLines;

        void addLine(const std::string& line);
        static void logCallback(void* userData, int category, SDL_LogPriority priority, const char* message);
};
