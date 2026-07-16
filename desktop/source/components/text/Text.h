#pragma once

#include <blend2d/blend2d.h>
#include <SDL3/SDL.h>
#include <string>

class Text {
    public:
        Text();
        ~Text();

        bool initFont();
        void draw(BLContext& context, const BLPoint& origin);

        void setFontFile(const std::string& fontPath) { this->fontPath = fontPath; }
        std::string getFontPath() const { return fontPath; }

        void setFontSize(float size) { fontSize = size; }
        float getFontSize() const { return fontSize; }

        void setColor(const BLRgba32 color) { this->color = color; }
        BLRgba32 getColor() const { return color; }

        void setLabel(const char* label) { this->label = label; }
        std::string getLabel() const { return label; }

        float measureWidth(const char* str);
        float getAscent() const { return font.metrics().ascent; }
        float getDescent() const { return font.metrics().descent; }

    private:
        BLFontFace fontFace;
        BLFont font;
        std::string fontPath;
        BLResult result;
        float fontSize;
        float loadedFontSize;
        BLRgba32 color;
        std::string label;
};
