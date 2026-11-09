# ريل جوشن — «أثركم يستحق أن يُرى»

إعلان موشن جرافيك 9:16 (1080×1920، 60 فريم، 30.6 ثانية) لشركة جوشن عن أهمية الفيديو للجمعيات الخيرية.

- `SCRIPT.md` — سكربت التعليق الصوتي بالتوقيت (للتسجيل).
- `script.json` + `tools/plan_timeline.py` — خطة التوقيت ← `timeline.json`.
- `scenes/` — المشاهد الستة + `lib.js` (الشعار المتجهي، الأيقونات، الخلفيات).
- `sfx.json` — المؤثرات الصوتية.
- `out/gotion-reel.mp4` — النسخة الحالية (موسيقى + مؤثرات، بدون تعليق صوتي).
- `out/gotion-reel-sfx-only.mp4` — مؤثرات فقط (لو هتركّب موسيقى بنفسك).

## إعادة الرسم
المحرّك في `.claude/skills/video-ad-editor/motion` (كروم بلا واجهة + ffmpeg):

```bash
python3 tools/plan_timeline.py            # بعد أي تعديل في التوقيت
tools/r.sh preview 2 8 13 18 23 28 --safe # لقطات معاينة
tools/r.sh all --fresh                    # الرسم الكامل
python3 ../.claude/skills/video-ad-editor/motion/audio.py .   # الصوت ← renders/final.mp4
```

## بعد تسجيل الصوت
حط التسجيل في `vo/` — نطلّع توقيت كل كلمة، نحدّث `timeline.json`، والمشاهد تتزامن لوحدها لأنها مربوطة بتوقيت الكلمات.
