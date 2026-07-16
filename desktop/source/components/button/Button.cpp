#include "Button.h"

Button::Button()
    : rect(0, 0, 0, 0), label("Button"), backgroundColor(BLRgba32(0xFFFFFFFF)) {}

Button::~Button() {}

void Button::setRectangle(double x, double y, double width, double height) {
    rect.x = x;
    rect.y = y;
    rect.w = width;
    rect.h = height;
}

void Button::draw(BLContext& context, Text& text) {
    context.fill_rect(rect, backgroundColor);

    text.setLabel(label.c_str());
    text.setFontSize(fontSize);
    text.setColor(textColor);

    float textWidth = text.measureWidth(label.c_str());
    float ascent = text.getAscent();
    float descent = text.getDescent();

    double originX = rect.x + (rect.w - textWidth) / 2.0;
    double originY = rect.y + (rect.h + ascent - descent) / 2.0;

    text.draw(context, BLPoint(originX, originY));
}
