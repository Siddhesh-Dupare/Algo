cmake_minimum_required(VERSION 3.20)
project (AlgoLens CXX C)

# Set the global C++ Standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
enable_testing()

# Windows-specific settings
if (MSVC)
  add_compile_options(/Z7)

  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()

include (FetchContent)

# Fetching SDL3 latest version from the repository
FetchContent_Declare(SDL3
  GIT_REPOSITORY https://github.com/libsdl-org/SDL.git
  GIT_TAG release-3.4.12)
set(SDL_SHARED ON CACHE BOOL "Build shared SDL library" FORCE)
set(SDL_STATIC ON CACHE BOOL "Build static SDL library" FORCE)
set(SDL_TEST ON CACHE BOOL "Build SDL test programs" FORCE)
FetchContent_MakeAvailable(SDL3)

FetchContent_Declare(asmjit
  URL https://github.com/asmjit/asmjit/archive/refs/heads/master.tar.gz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_GetProperties(asmjit)
if(NOT asmjit_POPULATED)
  FetchContent_Populate(asmjit)
endif()
set(ASMJIT_DIR ${asmjit_SOURCE_DIR} CACHE PATH "" FORCE)

# Fetching Blend2D latest version from the repository
FetchContent_Declare(blend2d
  URL https://github.com/blend2d/blend2d/archive/refs/heads/master.tar.gz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_MakeAvailable(blend2d)

# GoogleTest latest version
FetchContent_Declare(googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.17.0.zip
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# nlohmann/json
FetchContent_Declare(json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_MakeAvailable(json)

# ixwebsocket
set(USE_TLS OFF CACHE BOOL "" FORCE)
set(USE_ZLIB OFF CACHE BOOL "" FORCE)
set(IXWEBSOCKET_INSTALL OFF CACHE BOOL "" FORCE)
FetchContent_Declare(ixwebsocket
  URL https://github.com/machinezone/IXWebSocket/archive/refs/tags/v11.4.6.tar.gz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)
FetchContent_MakeAvailable(ixwebsocket)

# Dear ImGui
FetchContent_Declare(imgui
  URL https://github.com/ocornut/imgui/archive/refs/tags/v1.92.8.tar.gz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)
FetchContent_MakeAvailable(imgui)
set(IMGUI_DIR ${imgui_SOURCE_DIR})
set(IMGUI_SOURCES
  ${IMGUI_DIR}/imgui.cpp
  ${IMGUI_DIR}/imgui_draw.cpp
  ${IMGUI_DIR}/imgui_tables.cpp
  ${IMGUI_DIR}/imgui_widgets.cpp
  ${IMGUI_DIR}/imgui_demo.cpp
  ${IMGUI_DIR}/backends/imgui_impl_sdl3.cpp
  ${IMGUI_DIR}/backends/imgui_impl_sdlrenderer3.cpp
)

# NOTE: GoogleTest
add_executable(app_test
  tests/app_test.cpp
  tests/test_socket.cpp
  tests/test_font.cpp
  source/app.cpp
  source/connection/Socket.cpp
  source/components/text/Text.cpp
  source/components/button/Button.cpp
  source/helper/Utils.cpp
  ${IMGUI_SOURCES}
)

add_executable(AlgoLens
  source/app.cpp
  source/connection/Socket.cpp
  source/components/text/Text.cpp
  source/components/button/Button.cpp
  source/helper/Utils.cpp
  main.cpp
  ${IMGUI_SOURCES}
)

target_link_libraries(app_test PRIVATE
  SDL3::SDL3
  blend2d::blend2d
  GTest::gtest_main
  nlohmann_json::nlohmann_json
  ixwebsocket
)

include(GoogleTest)
gtest_discover_tests(app_test)

target_link_libraries(AlgoLens PRIVATE
  SDL3::SDL3
  blend2d::blend2d
  nlohmann_json::nlohmann_json
  ixwebsocket
)

target_include_directories(app_test PRIVATE
  ${IMGUI_DIR}
  ${IMGUI_DIR}/backends
)

target_include_directories(AlgoLens PRIVATE
  ${IMGUI_DIR}
  ${IMGUI_DIR}/backends
)

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
  "$<TARGET_FILE:SDL3::SDL3>" "$<TARGET_FILE_DIR:AlgoLens>"
  COMMENT "Copying SDL3.dll....")

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
  "$<TARGET_FILE:blend2d::blend2d>" "$<TARGET_FILE_DIR:AlgoLens>"
  COMMENT "Copying blend2d.dll....")

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_directory
  "${CMAKE_SOURCE_DIR}/assets" "$<TARGET_FILE_DIR:AlgoLens>/assets"
  COMMENT "Copying assets....."
)
