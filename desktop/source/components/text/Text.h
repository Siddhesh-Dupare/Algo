#pragma once

#include <blend2d/blend2d.h>
#include <SDL3/SDL.h>
#include <string>

class Text {
    public:
        Text();
        ~Text();

        bool initFont();
        void draw(BLContext& context, const BLPoint& origin, const char* str, float fontSize);

    private:
        BLFontFace fontFace;
        BLFont font;
        std::string fontPath;
        BLResult result;
        float fontSize;
};
