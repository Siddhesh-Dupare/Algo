#pragma once

#include <nlohmann/json.hpp>
#include <fstream>
#include <stdexcept>
#include <string>
#include <SDL3/SDL_Log.h>

using json = nlohmann::json;

class JsonExtractor {
    private:
        std::ifstream file;
        json data;

        struct JsonData {
            std::string description;
            std::string algorithm;
            int totalSteps;
        };

        JsonData jsonData;

    public:
        JsonExtractor(const std::string& filename);
        ~JsonExtractor();

        // NOTE: Get Description
        std::string getDescription() const { return jsonData.description; }
        void setDescription(const std::string& desc) { jsonData.description = data[desc]; }

        // NOTE: Get Algorithm
        void setAlgorithm(const std::string& alg) { jsonData.algorithm = data[alg]; }
        std::string getAlgorithm() const { return jsonData.algorithm; }

        // NOTE: Total steps
        void setSteps(const std::string& steps) { jsonData.totalSteps = data[steps]; }
        int getSteps() const { return jsonData.totalSteps; }
};
