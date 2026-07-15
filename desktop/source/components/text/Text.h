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

        void setFontFile(const std::string& fontPath);
        std::string getFontPath() const;

        void setFontSize(float size);
        float getFontSize() const;

        void setColor(const BLRgba32 color);
        BLRgba32 getColor() const;

        void setLabel(const char* label);
        std::string getLabel() const;

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
