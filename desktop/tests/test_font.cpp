#include "../source/components/text/Text.h"

#include <gtest/gtest.h>

TEST(Text, InitReturnTrue) {
    Text text;
    ASSERT_TRUE(text.initFont());
}
