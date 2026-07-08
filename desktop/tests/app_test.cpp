#include <gtest/gtest.h>
#include "../source/app.h"

TEST(AppTest, ConstructorCreateObject) {
    app application;
    SUCCEED();
}

TEST(AppTest, InitReturnsTrue) {
    app application;
    EXPECT_TRUE(application.init());
    application.shutdown();
}

TEST(AppTest, ShutdownAfterInit) {
    app application;
    ASSERT_TRUE(application.init());
    EXPECT_NO_THROW(application.shutdown());
}
