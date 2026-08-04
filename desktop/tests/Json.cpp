#include <gtest/gtest.h>
#include "../source/format/json_extractor.h"

TEST(JsonExtractorTest, Init) {
    JsonExtractor extractor("../test-json.json");
    extractor.setDescription("description");
    ASSERT_NO_THROW(extractor.getDescription());
    SDL_Log("Description: %s", extractor.getDescription().c_str());

    extractor.setAlgorithm("algorithm");
    ASSERT_NO_THROW(extractor.getAlgorithm());
    SDL_Log("Algorithm: %s", extractor.getAlgorithm().c_str());

    extractor.setSteps("total_steps");
    ASSERT_NO_THROW(extractor.getSteps());
    SDL_Log("Total Steps: %d", extractor.getSteps());

    // ASSERT_EQ(extractor.getDescription(), "");
}
