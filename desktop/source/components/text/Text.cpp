#include "Text.h"
#include "../../helper/GetPath.h"

Text::Text()
    : fontFace(), font(), fontSize(-1.0f) {}

Text::~Text() {}

bool Text::initFont() {
    fontPath = getBasePath() + "assets\\font\\SourceCodePro.ttf";
    result = fontFace.create_from_file(fontPath.c_str());
    if (result != BL_SUCCESS) {
        SDL_Log("Failed to load font: %s", fontPath.c_str());
        return false;
    }
    return true;
}

void Text::draw(BLContext& context, const BLPoint& origin, const char* str, float fontSize) {
    if (fontSize != this->fontSize) {
        font.create_from_face(fontFace, fontSize);
        this->fontSize = fontSize;
    }
    context.set_fill_style(BLRgba32(0xFFFFFFFF));
    context.fill_utf8_text(origin, font, str);
}
