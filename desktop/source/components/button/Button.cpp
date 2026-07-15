#include "Button.h"

Button::Button()
    : rect(0, 0, 0, 0), label("Button") {}

Button::~Button() {}

void Button::setRectangle(double x, double y, double width, double height) {
    rect.x = x;
    rect.y = y;
    rect.w = width;
    rect.h = height;
}

void Button::setLabel(const char* label) {
    this->label = label;
}

void Button::draw(BLContext& context, Text& text) {
    context.fill_rect(rect, BLRgba32(0xFF505050));
    text.setLabel(label.c_str());
    text.draw(context, BLPoint(rect.x + 8, rect.y + rect.h - 8));
}
