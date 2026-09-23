#pragma once

#include "window/Window.h"
#include "renderer/Renderer.h"
#include "texture/Texture.h"
#include "SDLContext.h"

class App {
public:
    App();
    ~App();

    App(const App&) = delete;
    App& operator=(const App&) = delete;

    void run();

private:
    void handleResize(int width, int height);

    void processEvents();
    void update();
    void render();

private:
    int m_width { 1280 };
    int m_height { 700 };

    SDLContext m_sdl;
    Window m_window;
    Renderer m_renderer;
    Texture m_texture;

    bool is_running { true };
};
