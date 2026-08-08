#pragma once

#include <blend2d/blend2d.h>
#include <string>

enum class HorizontalAlignment {
    LEFT, CENTER, RIGHT
};
enum class VerticalAlignment {
    TOP, CENTER, BOTTOM
};

class Text {
    private:
        BLFont font;
        BLRgba32 color;
        BLPoint position;
        std::string context;

        BLTextMetrics textMetrics;
        BLFontMetrics fontMetrics;

        struct properties {
            double width;
            double height;
        } props;

    protected:
        void updateTextMetrics();
        void updateFontMetrics();

    public:
        Text(const std::string& context = "");

        // NOTE: Load font from the specified file
        bool loadFont(const char* fontPath, float fontSize);

        // NOTE: Content and style setter
        void setContext(const std::string& newContext);
        void setColor(BLRgba32 newColor) { this->color = newColor; }
        void setPosition(double x, double y) { position = BLPoint(x, y); }

        void setPositionInside(const BLPoint& bounds, double paddingX, double paddingY);

        // NOTE: Getters
        BLFontMetrics getMetrics() const { return font.metrics(); }
        BLPoint getPosition() const { return position; }

        // NOTE: Render
        void draw(BLContext& context) const;

        // NOTE: Count space
        double getWidth() const;
        double getHeight() const;
        // NOTE: Does not count for space in text
        double getExactWidth() const;

        // NOTE: Alignment set to default and center in horizontal and vertical
        void setAlignment(BLContext& context,
            HorizontalAlignment horizontal = HorizontalAlignment::CENTER,
            VerticalAlignment vertical = VerticalAlignment::CENTER);
};
