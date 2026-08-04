#include "Rectangle.h"

Rectangle::Rectangle(double x, double y, double w, double h, double rx, double ry)
    : x{x}, y{y}, width{w}, height{h}, rx{rx}, ry{ry},
    fillColor{BLRgba32(0xFF, 0xFF, 0xFF)},
    strokeColor{BLRgba32(0x00, 0x00, 0x00)},
    strokeWidth{0.0} {}

void Rectangle::draw(BLContext& context) const {
    BLRoundRect roundRect(x, y, width, height, rx, ry);

    // NOTE: Draw fill
    if ((fillColor.value & 0xFF000000) != 0) {
        context.set_fill_style(fillColor);
        context.fill_round_rect(roundRect);
    }

    // NOTE: Draw Stroke
    if ((strokeWidth > 0.0) && (strokeColor.value & 0xFF000000) != 0) {
        context.set_stroke_style(strokeColor);
        context.set_stroke_width(strokeWidth);
        context.stroke_round_rect(roundRect);
    }
}
