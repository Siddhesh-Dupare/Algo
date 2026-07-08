cmake_minimum_required(VERSION 3.20)
project (AlgoLens CXX C)

# Set the global C++ Standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

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

# asmjit: populate the source only (do NOT add_subdirectory it ourselves) -
# Blend2D's own CMakeLists adds it as a subdirectory via ASMJIT_DIR, so
# calling FetchContent_MakeAvailable(asmjit) here would create a duplicate target.
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

add_executable(AlgoLens
  source/app.cpp
  main.cpp
)

target_link_libraries(AlgoLens PRIVATE
  SDL3::SDL3
  blend2d::blend2d
)

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
  "$<TARGET_FILE:SDL3::SDL3>" "$<TARGET_FILE_DIR:AlgoLens>"
  COMMENT "Copying SDL3.dll....")

add_custom_command(TARGET AlgoLens POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
  "$<TARGET_FILE:blend2d::blend2d>" "$<TARGET_FILE_DIR:AlgoLens>"
  COMMENT "Copying blend2d.dll....")
