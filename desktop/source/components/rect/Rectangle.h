#pragma once

#include <blend2d/blend2d.h>
#include <vector>
#include "../text/Text.h"

class Rectangle {
    private:
        double x, y, width, height;
        double rx, ry; // NOTE: For border
        BLRgba32 fillColor;
        BLRgba32 strokeColor;
        double strokeWidth;

        std::vector<Text> text;
    public:
        Rectangle(double x, double y, double w, double h, double rx = 0.0, double ry = 0.0);

        // NOTE: Style setter
        void setFillColor(BLRgba32 color) { fillColor = color; }
        void setStroke(BLRgba32 color, double width) { strokeColor = color; strokeWidth = width; }
        void setCornerRadius(double rx, double ry) { this->rx = rx; this->ry = ry; }

        // NOTE: Position and Dimension setters
        void setPosition(double newX, double newY) { x = newX; y = newY; }
        void setSize(double newWidth, double newHeight) { width = newWidth; height = newHeight; }

        // NOTE: Getter for bounds
        BLRect getBounds() const { return BLRect(x, y, width, height); }

        // NOTE: Draw the rectangle
        void draw(BLContext& context) const;

        // NOTE: Text to stay relative to the rectangle
        void addText(Text text, double offsetX, double offsetY);

};
