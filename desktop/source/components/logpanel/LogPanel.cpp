#include "LogPanel.h"

LogPanel::LogPanel() : visible(false) { }

// NOTE: Capture the custom log from SDL3
void LogPanel::installLogCapture() {
    SDL_SetLogOutputFunction(LogPanel::logCallback, this);
}

void LogPanel::logCallback(void* userData, int category, SDL_LogPriority priority, const char* message) {
    LogPanel* self = static_cast<LogPanel*>(userData);
    self->addLine(message);
    printf("%s\n", message);
}

void LogPanel::addLine(const std::string& line) {
    std::lock_guard<std::mutex> lock(logMutex);
    logLines.push_back(line);
    if (logLines.size() > 200) {
        logLines.erase(logLines.begin());
    }
}

void LogPanel::draw(int windowWidth, int windowHeight) {
    ImGui::SetNextWindowPos(ImVec2((float)(windowWidth - 70), (float)(windowHeight - 40)));
    ImGui::SetNextWindowSize(ImVec2(60, 30));
    ImGui::Begin("Log Button", nullptr, ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove
        | ImGuiWindowFlags_NoScrollbar | ImGuiWindowFlags_NoBackground);

    if (ImGui::Button("Log", ImVec2(-1, -1))) {
        visible = !visible;
    }

    ImGui::End();

    if (visible) {
        ImGui::SetNextWindowPos(ImVec2((float)(windowWidth - 320), (float)(windowHeight - 240)));
        ImGui::SetNextWindowSize(ImVec2(310, 200));
        ImGui::Begin("Log Panel", nullptr, ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove);

        std::lock_guard<std::mutex> lock(logMutex);
        for (const auto& line : logLines) {
            ImGui::TextUnformatted(line.c_str());
        }
        ImGui::End();
    }
}
