#pragma once

#include <blend2d/blend2d.h>
#include <string>
#include "../text/Text.h"

class Button {
    public:
        Button();
        ~Button();

        void setRectangle(double x, double y, double width, double height);
        void setLabel(const char* label);
        void draw(BLContext& context, Text& text);

    private:
        BLRect rect;
        std::string label;
};
