#include <gtest/gtest.h>
#include "../source/app.h"

TEST(AppTest, InitCreatesWindow) {
    App app;
    EXPECT_TRUE(app.init());
}
