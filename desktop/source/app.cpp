#include "app.h"

App::App()
    : window{nullptr}, renderer{nullptr}, texture{nullptr}, isRunning{false} {}

App::~App() {
    shutdown();
}

void App::shutdown() {
    if (ImGui::GetCurrentContext()) {
        ImGui_ImplSDLRenderer3_Shutdown();
        ImGui_ImplSDL3_Shutdown();
        ImGui::DestroyContext();
    }
    if (window)
        SDL_DestroyWindow(window);
    if (texture)
        SDL_DestroyTexture(texture);
    if (renderer)
        SDL_DestroyRenderer(renderer);

    SDL_Quit();
}

bool App::init() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "SDL initialization failed: %s",
            SDL_GetError());
        return false;
    }

    float mainScale = SDL_GetDisplayContentScale(SDL_GetPrimaryDisplay());
    window = SDL_CreateWindow("Blend",
        (int)(WIDTH * mainScale), (int)(HEIGHT * mainScale), SDL_WINDOW_RESIZABLE);
    if (!window) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Window creation failed: %s",
            SDL_GetError());
        return false;
    }

    renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Renderer creation failed: %s", SDL_GetError());
        return false;
    }

    image.create(WIDTH ,HEIGHT, BL_FORMAT_PRGB32);
    texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB32, SDL_TEXTUREACCESS_STREAMING,
        WIDTH, HEIGHT);
    if (!texture) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Texture creation failed: %s", SDL_GetError());
        return false;
    }

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    (void)io;
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;

    ImGuiStyle& style = ImGui::GetStyle();
    style.ScaleAllSizes(mainScale);
    style.FontScaleDpi = mainScale;

    ImGui_ImplSDL3_InitForSDLRenderer(window, renderer);
    ImGui_ImplSDLRenderer3_Init(renderer);

    isRunning = true;
    return true;
}

void App::run() {
    int lastWidth = -1;
    int lastHeight = -1;

    while (isRunning) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT)
                isRunning = false;
        }

        int currentWidth, currentHeight;
        SDL_GetWindowSizeInPixels(window, &currentWidth, &currentHeight);
        if (currentWidth != lastWidth || currentHeight != lastHeight) {
            image.create(currentWidth, currentHeight, BL_FORMAT_PRGB32);
            if (texture) SDL_DestroyTexture(texture);
            texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB32,
                SDL_TEXTUREACCESS_STREAMING, currentWidth, currentHeight);
            lastWidth = currentWidth;
            lastHeight = currentHeight;
        }

        BLImageData data;
        image.get_data(&data);
        SDL_UpdateTexture(texture, nullptr, data.pixel_data, (int)data.stride);

        ImGui_ImplSDLRenderer3_NewFrame();
        ImGui_ImplSDL3_NewFrame();
        ImGui::NewFrame();

        BLContext context(image);
        context.clear_all();

        // NOTE: Start here

        context.end();
        image.write_to_file("output.png");

        ImGui::Render();

        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, texture, nullptr, nullptr);
        ImGui_ImplSDLRenderer3_RenderDrawData(ImGui::GetDrawData(), renderer);
        SDL_RenderPresent(renderer);
    }
}
