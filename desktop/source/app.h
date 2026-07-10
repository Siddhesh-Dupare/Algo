#pragma once

#include <SDL3/SDL.h>
#include <blend2d/blend2d.h>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>
#include <nlohmann/json.hpp>

#include <mutex>
#include <vector>

class app {
    public:
        app();
        ~app();

        bool init();
        void run();
        void shutdown();

    private:
        SDL_Window* window;
        SDL_Renderer* renderer;
        BLImage image;
        SDL_Texture* texture;

        bool running;
        int WIDTH;
        int HEIGHT;

        // Debug trace WebSocket client — receives trace-step data from the
        // backend (backend/src/debugSession.ts) when Debug is clicked in the
        // frontend. Messages arrive on IXWebSocket's own background thread,
        // so they're queued here and drained once per frame on the main
        // thread inside run() rather than touched directly from the callback.
        ix::WebSocket wsClient;
        std::mutex traceMutex;
        std::vector<nlohmann::json> pendingTraceSteps;

        void connectDebugSocket();
        void drainTraceSteps();
        void handleTraceStep(const nlohmann::json& step);
};
