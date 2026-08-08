#include "Text.h"
#include <SDL3/SDL_Log.h>

Text::Text(const std::string& context)
    : context{context},
    color{BLRgba32(0x00, 0x00, 0x00)},
    position{BLPoint(0, 0)} {

        if (!loadFont("assets/font/Inter_24pt-Regular.ttf", 18.0)) {
            SDL_LogError(SDL_LOG_CATEGORY_ERROR, "Failed to load font:");
            return;
        }

        setProperties();
}

bool Text::loadFont(const char* fontPath, float fontSize) {
    BLFontFace fontFace;
    if (fontFace.create_from_file(fontPath) != BL_SUCCESS)
        return false;
    return font.create_from_face(fontFace, fontSize) == BL_SUCCESS;
}

void Text::setProperties() {
    // NOTE: To get width of the text
    BLTextMetrics textMetrics;
    BLGlyphBuffer buffer;
    buffer.set_utf8_text(this->context.c_str());
    font.get_text_metrics(buffer, textMetrics);

    // NOTE: To get height of the text
    BLFontMetrics fontMetrics = font.metrics();

    props.width = textMetrics.advance.x;
    props.height = fontMetrics.ascent + fontMetrics.descent;
}

void Text::setPositionInside(const BLPoint& bounds, double paddingX, double paddingY) {
    BLFontMetrics metrics = font.metrics();

    position.x = bounds.x + paddingX;
    position.y = bounds.y + paddingY + metrics.ascent;
}

void Text::draw(BLContext& context) const {
    if (this->context.empty()) return;

    SDL_Log("Width: %f, Height: %f", props.width, props.height);

    context.set_fill_style(color);
    context.fill_utf8_text(position, font, this->context.c_str());
}
