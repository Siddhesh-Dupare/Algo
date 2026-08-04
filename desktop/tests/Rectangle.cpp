#include <gtest/gtest.h>
#include "../source/components/rect/Rectangle.h"

TEST(RectangleTest, Initialization) {
    Rectangle rect(0.0, 0.0, 10.0, 10.0);
    // EXPECT_EQ(rect.x, 0.0);
    // EXPECT_EQ(rect.y, 0.0);
    // EXPECT_EQ(rect.width, 10.0);
    // EXPECT_EQ(rect.height, 10.0);
    BLContext context;
    ASSERT_NO_THROW(rect.draw(context));
}
