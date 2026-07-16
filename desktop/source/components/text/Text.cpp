#include "Text.h"
#include "../../helper/Utils.h"

Text::Text()
    : fontFace(), font(),
      fontPath("assets\\font\\SourceCodePro.ttf"),
      loadedFontSize(-1.0f),
      fontSize(16.0f), color(BLRgba32(0xFFFFFFFF)) {}

Text::~Text() {}

bool Text::initFont() {
    std::string fullPath = getBasePath() + fontPath;
    result = fontFace.create_from_file(fontPath.c_str());
    if (result != BL_SUCCESS) {
        SDL_Log("Failed to load font: %s", fullPath.c_str());
        return false;
    }
    return true;
}

float Text::measureWidth(const char* str) {
    if (fontSize != loadedFontSize) {
        font.create_from_face(fontFace, fontSize);
        loadedFontSize = fontSize;
    }
    BLGlyphBuffer glyphBuffer;
    BLTextMetrics metrics;
    glyphBuffer.set_utf8_text(str);
    font.get_text_metrics(glyphBuffer, metrics);
    return (float)metrics.advance.x;
}

void Text::draw(BLContext& context, const BLPoint& origin) {
    if (fontSize != loadedFontSize) {
        font.create_from_face(fontFace, fontSize);
        loadedFontSize = fontSize;
    }
    context.set_fill_style(color);
    context.fill_utf8_text(origin, font, label.c_str());
}
