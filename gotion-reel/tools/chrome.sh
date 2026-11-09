#!/bin/bash
# متصفح الرسم في البيئة السحابية (من غير كارت شاشة): نفس كروم بس برسم برمجي
exec "${CHROME_BIN:-/opt/pw-browsers/chromium}" "$@" --no-sandbox --use-angle=swiftshader --use-gl=angle --enable-unsafe-swiftshader
