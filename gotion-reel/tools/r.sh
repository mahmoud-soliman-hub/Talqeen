#!/bin/bash
# تشغيل أوامر محرك الموشن على المشروع ده:  tools/r.sh preview 1 2 3 --safe   |   tools/r.sh all
HERE="$(cd "$(dirname "$0")/.." && pwd)"; ENGINE="$HERE/../.claude/skills/video-ad-editor/motion"
[ "$(uname)" = Linux ] && export CHROME="$HERE/tools/chrome.sh"
exec node "$ENGINE/render.js" "$HERE" "$@"
