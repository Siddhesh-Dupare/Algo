#include "Text.h"
#include <SDL3/SDL_Log.h>

Text::Text(const std::string& context)
    : context{context},
    color{BLRgba32(0x00, 0x00, 0x00)},
    position{BLPoint(0, 0)} {

    if (loadFont("assets/font/Inter_24pt-Bold.ttf", 16.0)) {
        updateTextMetrics();

        props.width = getWidth();
        props.height = getHeight();
    }
}

bool Text::loadFont(const char* fontPath, float fontSize) {
    BLFontFace fontFace;
    if (fontFace.create_from_file(fontPath) != BL_SUCCESS)
        return false;
    return font.create_from_face(fontFace, fontSize) == BL_SUCCESS;
}

void Text::setContext(const std::string& newContext) {
    this->context = newContext;
    updateTextMetrics();
    updateFontMetrics();

    props.width = getWidth();
    props.height = getHeight();
}

void Text::setPositionInside(const BLPoint& bounds, double paddingX, double paddingY) {
    BLFontMetrics metrics = font.metrics();

    position.x = bounds.x + paddingX;
    position.y = bounds.y + paddingY + metrics.ascent;
}

void Text::draw(BLContext& context) const {
    if (this->context.empty()) return;

    context.set_fill_style(color);
    context.fill_utf8_text(position, font, this->context.c_str());
}

void Text::updateTextMetrics() {
    BLGlyphBuffer buffer;
    buffer.set_utf8_text(this->context.c_str());

    font.get_text_metrics(buffer, textMetrics);
}

void Text::updateFontMetrics() {
    fontMetrics = font.metrics();
}

double Text::getWidth() const {
    if (this->context.empty()) return 0.0;

    return textMetrics.advance.x;
}

double Text::getExactWidth() const {
    if (this->context.empty()) return 0.0;

    return textMetrics.bounding_box.x1 - textMetrics.bounding_box.x0;
}

double Text::getHeight() const {
    if (this->context.empty()) return 0.0;

    return fontMetrics.ascent - fontMetrics.descent;
}

void Text::setAlignment(BLContext& context, HorizontalAlignment horizontal, VerticalAlignment vertical) {
    if (horizontal == HorizontalAlignment::LEFT) {
        position.x = 0;
    } else if (horizontal == HorizontalAlignment::CENTER) {
        position.x = (context.target_width() - props.width) / 2.0;
    }

    if (vertical == VerticalAlignment::TOP) {
        position.y = props.height + 20.0;
    }
}
