#include "LogPanel.h"

LogPanel::LogPanel() : visible(false) { }

LogPanel::~LogPanel() {
    SDL_SetLogOutputFunction(SDL_GetDefaultLogOutputFunction(), nullptr);
}

// NOTE: Capture the custom log from SDL3
void LogPanel::installLogCapture() {
    SDL_SetLogOutputFunction(LogPanel::logCallback, this);
}

void LogPanel::logCallback(void* userData, int category, SDL_LogPriority priority, const char* message) {
    LogPanel* self = static_cast<LogPanel*>(userData);
    self->addLine(message, priority);
    printf("%s\n", message);
}

void LogPanel::addLine(const std::string& line, SDL_LogPriority priority) {
    ImVec4 color;

    // NOTE: Map SDL log priority to color
    switch (priority) {
        case SDL_LOG_PRIORITY_ERROR:
        case SDL_LOG_PRIORITY_CRITICAL:
            color = ImVec4(1.0f, 0.35f, 0.35f, 1.0f); // NOTE: Red
            break;
        case SDL_LOG_PRIORITY_WARN:
            color = ImVec4(1.0f, 0.8f, 0.2f, 1.0f); // NOTE: Yellow
            break;
        case SDL_LOG_PRIORITY_DEBUG:
        case SDL_LOG_PRIORITY_VERBOSE:
        case SDL_LOG_PRIORITY_TRACE:
            color = ImVec4(0.6f, 0.6f, 0.6f, 1.0f); // NOTE: Gray
            break;
        default:
            color = ImVec4(1.0f, 1.0f, 1.0f, 1.0f); // NOTE: White
            break;
    }

    std::lock_guard<std::mutex> lock(logMutex);
    logLines.push_back({line, color});
    if (logLines.size() > 200) {
        logLines.erase(logLines.begin());
    }
}

void LogPanel::addTraceLine(const std::string& line) {
    ImVec4 traceColor = ImVec4(0.4f, 0.7f, 1.0f, 1.0f);
    std::lock_guard<std::mutex> lock(logMutex);
    logLines.push_back({line, traceColor});
    if (logLines.size() > 200) {
        logLines.erase(logLines.begin());
    }
}

void LogPanel::draw(int windowWidth, int windowHeight) {
    ImGui::SetNextWindowPos(ImVec2((float)(windowWidth - 70), (float)(windowHeight - 40)));
    ImGui::SetNextWindowSize(ImVec2(60, 30));
    ImGui::Begin("Log Button", nullptr,
        ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove
        | ImGuiWindowFlags_NoScrollbar | ImGuiWindowFlags_NoBackground);

    if (ImGui::Button("Log", ImVec2(-1, -1))) {
        visible = !visible;
    }

    ImGui::End();

    if (visible) {
        ImGui::SetNextWindowPos(ImVec2((float)(windowWidth - 320), (float)(windowHeight - 240)));
        ImGui::SetNextWindowSize(ImVec2(310, 200));
        ImGui::Begin("Log Panel", nullptr,
            ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove);

        std::lock_guard<std::mutex> lock(logMutex);
        for (const auto& entry : logLines) {
            ImGui::TextColored(entry.color, "%s", entry.message.c_str());
        }
        ImGui::End();
    }
}
