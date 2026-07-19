#include "app.h"
#include "blend2d/core/api.h"
#include "blend2d/core/format.h"

app::app() :
window{nullptr}, renderer{nullptr}, texture{nullptr},
running{false} {}

app::~app() {
    shutdown();
}

void app::shutdown() {
    if (ImGui::GetCurrentContext()) {
        ImGui_ImplSDLRenderer3_Shutdown();
        ImGui_ImplSDL3_Shutdown();
        ImGui::DestroyContext();
    }

    if (renderer)
        SDL_DestroyRenderer(renderer);
    if (texture)
        SDL_DestroyTexture(texture);
    if (window)
        SDL_DestroyWindow(window);
    SDL_Quit();
}

bool app::init() {
    logPanel.installLogCapture(); // NOTE: initialize log capture
    // NOTE: See if the initialization succeeds
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL_INIT Failed: %s", SDL_GetError());
        return false;
    }

    // NOTE: SDL Window
    float mainScale = SDL_GetDisplayContentScale(SDL_GetPrimaryDisplay());
    window = SDL_CreateWindow("AlgoLens", (int)(WIDTH * mainScale), (int)(HEIGHT * mainScale), SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE);
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
    SDL_SetTextureBlendMode(texture, SDL_BLENDMODE_BLEND_PREMULTIPLIED);

    // NOTE: loading the web socket
    if (!socket.webSocketInit()) {
        SDL_Log("Failed to load websocket");
        return false;
    }

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    (void)io;
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard; // NOTE: Enable keyboard navigation
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad; // NOTE: Enable gamepad navigation

    ImGuiStyle& style = ImGui::GetStyle();
    style.ScaleAllSizes(mainScale);
    style.FontScaleDpi = mainScale;

    ImGui_ImplSDL3_InitForSDLRenderer(window, renderer);
    ImGui_ImplSDLRenderer3_Init(renderer);

    // NOTE: If everything succeeds, set running to true
    running = true;
    return true;
}

void app::run() {
    int lastWidth = -1;
    int lastHeight = -1;

    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            ImGui_ImplSDL3_ProcessEvent(&event);
            // NOTE: Handle quit event for the window
            if (event.type == SDL_EVENT_QUIT)
                running = false;
        }

        int currentWidth, currentHeight;
        SDL_GetWindowSizeInPixels(window, &currentWidth, &currentHeight);

        if (currentWidth != lastWidth || currentHeight != lastHeight) {
            image.create(currentWidth, currentHeight, BL_FORMAT_PRGB32);
            if (texture) SDL_DestroyTexture(texture);
            texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB32, SDL_TEXTUREACCESS_STREAMING, currentWidth, currentHeight);
            SDL_SetTextureBlendMode(texture, SDL_BLENDMODE_BLEND_PREMULTIPLIED);
            lastWidth = currentWidth;
            lastHeight = currentHeight;
        }

        socket.drainTraceSteps();

        BLImageData data;
        image.get_data(&data);
        SDL_UpdateTexture(texture, nullptr, data.pixel_data, (int)data.stride);

        ImGui_ImplSDLRenderer3_NewFrame();
        ImGui_ImplSDL3_NewFrame();
        ImGui::NewFrame();

        // TODO: Code goes here for ImGui::Begin()/ImGui::End() widgets
        // NOTE: Log Panel
        logPanel.draw(currentWidth, currentHeight);

        ImGui::Render();

        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, texture, nullptr, nullptr);
        ImGui_ImplSDLRenderer3_RenderDrawData(ImGui::GetDrawData(), renderer);
        SDL_RenderPresent(renderer);
    }
}
