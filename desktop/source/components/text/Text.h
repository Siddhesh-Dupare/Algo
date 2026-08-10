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

        BLFontMetrics fontMetrics;

        struct Properties {
            double width;
            double height;
        } props;

    protected:
        void setProperties();

    public:
        Text(const std::string& context = "");

        // NOTE: Load font from the specified file
        bool loadFont(const char* fontPath, float fontSize);

        // NOTE: Content and style setter
        void setContext(const std::string& newContext) { this->context = newContext; }
        void setColor(BLRgba32 newColor) { this->color = newColor; }
        void setPosition(double x, double y) { position = BLPoint(x, y); }

        void setPositionInside(const BLPoint& bounds, double paddingX, double paddingY);

        // NOTE: Getters
        BLFontMetrics getMetrics() const { return font.metrics(); }
        BLPoint getPosition() const { return position; }
        double getWidth() const { return props.width; }
        double getHeight() const { return props.height; }

        // NOTE: Render
        void draw(BLContext& context) const;

        // NOTE: Alignment
        void setAlignment(BLContext& context, HorizontalAlignment horizontal, VerticalAlignment vertial);
};
