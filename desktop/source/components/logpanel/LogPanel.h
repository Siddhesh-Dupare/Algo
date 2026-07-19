#pragma once

#include <imgui.h>
#include <SDL3/SDL.h>
#include <string>
#include <vector>
#include <mutex>

struct LogEntry {
    std::string message;
    ImVec4 color;
};

class LogPanel {
    public:
        LogPanel();
        ~LogPanel();
        void draw(int windowWidth, int windowHeight);
        void installLogCapture();

    private:
        bool visible;
        std::mutex logMutex;
        std::vector<LogEntry> logLines;

        void addLine(const std::string& line, SDL_LogPriority priority);
        static void logCallback(void* userData, int category, SDL_LogPriority priority, const char* message);
};
