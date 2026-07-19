#include "LogPanel.h"

LogPanel::LogPanel() : visible(false) { }

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
        ImGui::Text("Log output goes here...");
        ImGui::End();
    }
}
