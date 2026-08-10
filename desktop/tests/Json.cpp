#include <gtest/gtest.h>
#include "../source/format/json_extractor.h"
#include "SDL3/SDL_Log.h"

TEST(JsonExtractorTest, LoadTheData) {
    JsonExtractor extractor;
    ASSERT_TRUE(extractor.isLoaded());

    ASSERT_NE(extractor.getDescription(), "");

    for (const auto& step : extractor.getSteps()) {
        ASSERT_NE(step.stepId, 0);
        ASSERT_NE(step.description, "");
        ASSERT_NE(step.action, "");
        ASSERT_NE(step.explanation, "");

        for (const auto& [key, value] : step.variables) {
            std::string valueString = value.dump();

            SDL_Log("Variables: %s = %s", key.c_str(), valueString.c_str());
        }
    }
}
