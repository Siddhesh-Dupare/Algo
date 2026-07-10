#include "app.h"

app::app() : window{nullptr}, renderer{nullptr}, texture{nullptr}, running{false}, WIDTH{900}, HEIGHT{700} {}

app::~app() {
    shutdown();
}

void app::shutdown() {
    wsClient.stop();
    ix::uninitNetSystem();

    if (renderer)
        SDL_DestroyRenderer(renderer);
    if (texture)
        SDL_DestroyTexture(texture);
    if (window)
        SDL_DestroyWindow(window);
    SDL_Quit();
}

bool app::init() {
    // NOTE: See if the initialization succeeds
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL_INIT Failed: %s", SDL_GetError());
        return false;
    }

    // NOTE: SDL Window
    window = SDL_CreateWindow("AlgoLens", WIDTH, HEIGHT, SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE);
    if (!window) {
        SDL_Log("Window creation failed: %s", SDL_GetError());
        return false;
    }

    // NOTE: SDL Renderer
    renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SDL_Log("Renderer creation failed: %s", SDL_GetError());
        return false;
    }

    image.create(WIDTH, HEIGHT, BL_FORMAT_PRGB32);
    texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB32, SDL_TEXTUREACCESS_STREAMING, WIDTH, HEIGHT);
    if (!texture) {
        SDL_Log("Texture creation failed: %s", SDL_GetError());
        return false;
    }

    connectDebugSocket();

    // NOTE: If everything succeeds, set running to true
    running = true;
    return true;
}

void app::connectDebugSocket() {
    ix::initNetSystem();
    wsClient.setUrl("ws://localhost:3001");
    wsClient.setOnMessageCallback([this](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Open) {
            nlohmann::json reg = {{"type", "register"}, {"role", "desktop"}};
            wsClient.send(reg.dump());
        } else if (msg->type == ix::WebSocketMessageType::Message) {
            try {
                auto parsed = nlohmann::json::parse(msg->str);
                std::lock_guard<std::mutex> lock(traceMutex);
                pendingTraceSteps.push_back(parsed);
            } catch (...) {
                // malformed message from backend — ignore
            }
        }
    });
    wsClient.start();
}

void app::drainTraceSteps() {
    std::vector<nlohmann::json> steps;
    {
        std::lock_guard<std::mutex> lock(traceMutex);
        steps.swap(pendingTraceSteps);
    }
    for (const auto& step : steps)
        handleTraceStep(step);
}

void app::handleTraceStep(const nlohmann::json& message) {
    std::string type = message.value("type", "");
    if (type == "trace-step") {
        auto s = message.value("step", nlohmann::json::object());
        int line = s.value("line", -1);
        std::string event = s.value("event", "");
        SDL_Log("[trace-step] line=%d event=%s", line, event.c_str());
    } else if (type == "trace-complete") {
        SDL_Log("[trace] complete");
    } else if (type == "trace-error") {
        SDL_Log("[trace] error: %s", message.value("message", "").c_str());
    }
}

void app::run() {
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            // NOTE: Handle quit event for the window
            if (event.type == SDL_EVENT_QUIT)
                running = false;
        }

        drainTraceSteps();

        BLContext context(image);
        context.clear_all();
        context.fill_rect(BLRect(50, 50, 200, 150), BLRgba32(0xFF00A0FF));
        context.end();

        BLImageData data;
        image.get_data(&data);
        SDL_UpdateTexture(texture, nullptr, data.pixel_data, (int)data.stride);

        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, texture, nullptr, nullptr);
        SDL_RenderPresent(renderer);
    }
}
