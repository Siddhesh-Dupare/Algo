#pragma once

#include <blend2d/blend2d.h>
#include <string>
#include "../text/Text.h"

class Button {
    public:
        Button();
        ~Button();

        void setRectangle(double x, double y, double width, double height);
        void setLabel(const char* label) { this->label = label; }
        void setBackgroundColor(BLRgba32 color) { backgroundColor = color; }
        void setFontSize(float size) { fontSize = size; }
        void setTextColor(BLRgba32 color) { textColor = color; }
        void draw(BLContext& context, Text& text);

    private:
        BLRect rect;
        std::string label;
        BLRgba32 backgroundColor;
        float fontSize;
        BLRgba32 textColor;
};
