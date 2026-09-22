#include "json_extractor.h"

JsonExtractor::JsonExtractor(const std::string& filename) : file{filename} {
    if (!file.is_open()) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Failed to open file: %s", filename.c_str());
        throw std::runtime_error("Failed to open file: " + filename);
    }

    extractData();
}

JsonExtractor::~JsonExtractor() {
    if (file.is_open()) {
        file.close();
    }
}

void JsonExtractor::extractData() {
    try {
        file >> data;

        description = data.value("description", "Unknown");
        algorithm = data.value("algorithm", "Unknown");
        totalSteps = data.value("total_steps", 0);

        if (data.contains("steps") && data["steps"].is_array()) {
            for (const auto& item : data["steps"]) {
                StepData step;
                step.stepId = item.value("step_id", 0);
                step.description = item.value("description", "Unknown");
                step.action = item.value("action", "Unknown");
                step.explanation = item.value("explanation", "Unknown");
                step.active_index = item.value("active_index", -1);
                step.highlight_index = item.value("highlight_index", -1);

                if (item.contains("variables") && item["variables"].is_object()) {
                    step.variables = item["variables"].get<std::unordered_map<std::string, nlohmann::json>>();
                }

                steps.push_back(step);
            }
        }

        loadedSuccessfully = true;
    }

    catch (const std::exception& e) {
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Failed to extract data: %s", e.what());
        loadedSuccessfully = false;
    }
}
