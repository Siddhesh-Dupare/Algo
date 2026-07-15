#include "app.h"
#include "blend2d/core/api.h"
#include "blend2d/core/context.h"

app::app() :
window{nullptr}, renderer{nullptr}, texture{nullptr},
running{false} {}

app::~app() {
    shutdown();
}

void app::shutdown() {
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
    SDL_SetTextureBlendMode(texture, SDL_BLENDMODE_BLEND_PREMULTIPLIED);

    // NOTE: initialize the text font
    if (!text.initFont()) {
        SDL_Log("Failed to load font");
        return false;
    }

    // NOTE: loading the web socket
    if (!socket.webSocketInit()) {
        SDL_Log("Failed to load websocket");
        return false;
    }

    // NOTE: If everything succeeds, set running to true
    running = true;
    return true;
}

void app::run() {
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            // NOTE: Handle quit event for the window
            if (event.type == SDL_EVENT_QUIT)
                running = false;
        }

        socket.drainTraceSteps();

        BLContext context(image);
        context.clear_all();

        button.setRectangle(60.0f, 80.0f, 80.0f, 40.0f);
        button.setLabel("Buttons for me");
        button.draw(context, text);

        BLImageData data;
        image.get_data(&data);
        SDL_UpdateTexture(texture, nullptr, data.pixel_data, (int)data.stride);

        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, texture, nullptr, nullptr);
        SDL_RenderPresent(renderer);
    }
}
