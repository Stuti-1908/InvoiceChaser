"""Makes audio/call-en.mp3 and audio/call-ar.mp3 with Microsoft's natural voices.
Run on a computer with internet (needs Python): double-click make_call_audio.bat
"""
import asyncio, os
import edge_tts

CALL = {
 "en": [("bot", "Hi Khalid! Sara here, from Al Noor Trading."),
        ("bot", "Just a quick reminder, invoice 2033 is now due. Is everything okay with it?"),
        ("cust", "Oh yes, thanks! Noted. We'll send it by Thursday."),
        ("bot", "Perfect! I'll note Thursday and send the payment link on WhatsApp. Have a great day!"),
        ("cust", "You too, bye!")],
 "ar": [("bot", "مرحباً خالد! معك سارة من شركة النور للتجارة."),
        ("bot", "بس تذكير سريع، الفاتورة ٢٠٣٣ صارت مستحقة. كل شي تمام؟"),
        ("cust", "أهلاً، شكراً! تمام، بنحوّلها يوم الخميس."),
        ("bot", "ممتاز! سجّلت الخميس، وبرسل لك رابط الدفع على الواتساب. يومك سعيد!"),
        ("cust", "وأنت كمان، مع السلامة!")],
}
VOICES = {"en": {"bot": "en-US-AriaNeural", "cust": "en-US-GuyNeural"},
          "ar": {"bot": "ar-AE-FatimaNeural", "cust": "ar-AE-HamdanNeural"}}

async def main():
    os.makedirs("audio", exist_ok=True)
    for lang, lines in CALL.items():
        out = bytearray()
        for i, (who, text) in enumerate(lines):
            tmp = f"audio/_{lang}{i}.mp3"
            await edge_tts.Communicate(text, VOICES[lang][who], rate="+8%").save(tmp)
            out += open(tmp, "rb").read(); os.remove(tmp)
        open(f"audio/call-{lang}.mp3", "wb").write(out)
        print("made", f"audio/call-{lang}.mp3")

asyncio.run(main())
