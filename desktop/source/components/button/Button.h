#pragma once

#include <blend2d/blend2d.h>

class Button {
    public:
        Button();
        ~Button();

        void setRectangle(double x, double y, double width, double height);
        void draw(BLContext& context);

    private:
        BLRect rect;
        bool isVisible;
};
