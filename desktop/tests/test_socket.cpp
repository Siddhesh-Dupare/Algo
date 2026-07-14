#include <gtest/gtest.h>
#include "../source/connection/Socket.h"

TEST(SocketTest, ConstructorCreateObject) {
    Socket socket;
    SUCCEED();
}

TEST(SocketInit, InitReturnsTrue) {
    Socket socket;
    EXPECT_TRUE(socket.webSocketInit());
}
