cmake_minimum_required(VERSION 3.20)
project (AlgoLens CXX C)

# Set the global C++ Standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Windows-specific settings
if (MSVC)
  add_compile_options(/Z7)

  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()

# Get the glad from external folder
set(GLAD_DIR "${CMAKE_SOURCE_DIR}/external/glad")

include (FetchContent)

# Fetching SDL3 latest version from the repository
FetchContent_Declare(SDL3
  GIT_REPOSITORY https://github.com/libsdl-org/SDL.git
  GIT_TAG release-3.4.12)
set(SDL_SHARED ON CACHE BOOL "Build shared SDL library" FORCE)
set(SDL_STATIC ON CACHE BOOL "Build static SDL library" FORCE)
set(SDL_TEST ON CACHE BOOL "Build SDL test programs" FORCE)
FetchContent_MakeAvailable(SDL3)

# glad (OpenGL 3.3 loader)
add_library(glad STATIC "${GLAD_DIR}/src/glad.c")
target_include_directories(glad PUBLIC
  "${GLAD_DIR}/include"
)

add_executable(AlgoLens
  source/app.cpp
  main.cpp
)

target_link_libraries(AlgoLens PRIVATE
  SDL3::SDL3
  opengl32
  glad
)

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
  "$<TARGET_FILE:SDL3::SDL3>" "$<TARGET_FILE_DIR:AlgoLens>"
  COMMENT "Copying SDL3.dll...."
)
