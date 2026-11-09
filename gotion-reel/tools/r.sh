#!/bin/bash
# تشغيل محرّك الرسم على السحابة: tools/r.sh preview 1 2 3 --safe | all | range a b
P=$(cd "$(dirname "$0")/.." && pwd)
cd "$P/../.claude/skills/video-ad-editor/motion" && CHROME=${CHROME:-/tmp/claude-0/-home-user-Talqeen/79d8795d-547c-5e30-bd32-aff2d1665bbc/scratchpad/tools/chrome.sh} NODE_PATH=/tmp/claude-0/-home-user-Talqeen/79d8795d-547c-5e30-bd32-aff2d1665bbc/scratchpad/tools/node_modules:$NODE_PATH node render.js "$P" "$@"
