#include "json_extractor.h"

JsonExtractor::JsonExtractor(const std::string& filename) : file{filename} {
    if (!file.is_open()) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Failed to open file: %s", filename.c_str());
        throw std::runtime_error("Failed to open file: " + filename);
    }

    file >> data;
}

JsonExtractor::~JsonExtractor() {
    if (file.is_open()) {
        file.close();
    }
}
