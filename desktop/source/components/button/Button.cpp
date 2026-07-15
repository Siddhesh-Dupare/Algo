#include "Button.h"

Button::Button()
    : rect(0, 0, 0, 0), isVisible(false) {}

Button::~Button() {}

void Button::setRectangle(double x, double y, double width, double height) {
    rect.x = x;
    rect.y = y;
    rect.w = width;
    rect.h = height;
}

void Button::draw(BLContext& context) {
    context.fill_rect(rect, BLRgba32(0xFF505050));
}
