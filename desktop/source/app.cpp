#include "app.h"

#include <glad/glad.h>

app::app() : window{nullptr}, glContext{nullptr}, running{false}, WIDTH{900}, HEIGHT{700} {}

app::~app() {
    shutdown();
}

void app::shutdown() {
    if (glContext)
        SDL_GL_DestroyContext(glContext);
    if (window)
        SDL_DestroyWindow(window);
    SDL_Quit();
}

bool app::init() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL_INIT Failed: %s", SDL_GetError());
        return false;
    }

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 1);
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 4);
    SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

    // SDL Window
    window = SDL_CreateWindow("AlgoLens", WIDTH, HEIGHT, SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE);
    if (!window) {
        SDL_Log("Window creation failed: %s", SDL_GetError());
        return false;
    }

    // OpenGL Window Context
    glContext = SDL_GL_CreateContext(window);
    if (!glContext) {
        SDL_Log("GL context failed: %s", SDL_GetError());
        return false;
    }
    SDL_GL_MakeCurrent(window, glContext);

    // glad fetcher for gl contexts
    if (!gladLoadGLLoader(reinterpret_cast<GLADloadproc>(SDL_GL_GetProcAddress))) {
        SDL_Log("Failed to initialize glad");
        return false;
    }
    SDL_Log("OpenGL %s", glGetString(GL_VERSION));

    SDL_GL_SetSwapInterval(1);
    running = true;
    return true;
}

void app::run() {
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT)
                running = false;
        }

        int pw = WIDTH;
        int ph = HEIGHT;

        SDL_GetWindowSizeInPixels(window, &pw, &ph);
        glViewport(0, 0, pw, ph);

        glClear(GL_COLOR_BUFFER_BIT);
        SDL_GL_SwapWindow(window);
    }
}
