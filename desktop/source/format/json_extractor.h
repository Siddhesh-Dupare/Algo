#pragma once

#include <nlohmann/json.hpp>
#include <fstream>
#include <stdexcept>
#include <string>
#include <SDL3/SDL_Log.h>
#include <vector>
#include <unordered_map>

using json = nlohmann::json;

struct StepData {
    int stepId;
    std::string description;
    std::string action;
    std::string explanation;
    int active_index;
    int highlight_index;
    std::unordered_map<std::string, nlohmann::json> variables;
};

class JsonExtractor {
    private:
        std::ifstream file;
        json data;

        std::string description;
        std::string algorithm;
        int totalSteps;
        std::vector<StepData> steps;

        bool loadedSuccessfully;

    protected:
        void extractData();

    public:
        explicit JsonExtractor(const std::string& filename = "assets/json/test-json.json");
        ~JsonExtractor();

        bool isLoaded() const { return loadedSuccessfully; }

        // NOTE: Getters
        std::string getDescription() const { return description; }
        std::string getAlgorithm() const { return algorithm; }
        int getTotalSteps() const { return totalSteps; }
        const std::vector<StepData>& getSteps() const { return steps; }
};
