#include "Text.h"

Text::Text(const std::string& context)
    : context{context},
    color{BLRgba32(0x00, 0x00, 0x00)},
    position{BLPoint(0, 0)} {}

bool Text::loadFont(const char* fontPath, float fontSize) {
    BLFontFace fontFace;
    if (fontFace.create_from_file(fontPath) != BL_SUCCESS)
        return false;
    return font.create_from_face(fontFace, fontSize) == BL_SUCCESS;
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
