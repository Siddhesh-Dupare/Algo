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

void Text::draw(BLContext& context, const BLPoint& origin) {
    if (fontSize != loadedFontSize) {
        font.create_from_face(fontFace, fontSize);
        loadedFontSize = fontSize;
    }
    context.set_fill_style(color);
    context.fill_utf8_text(origin, font, label.c_str());
}

void Text::setFontFile(const std::string& path) {
    fontPath = path;
}
std::string Text::getFontPath() const {
    return fontPath;
}

void Text::setFontSize(float size) {
    fontSize = size;
}
float Text::getFontSize() const {
    return fontSize;
}

void Text::setColor(const BLRgba32 color) {
    this->color = color;
}
BLRgba32 Text::getColor() const {
    return color;
}

void Text::setLabel(const char* label) {
    this->label = label;
}
std::string Text::getLabel() const {
    return label;
}
