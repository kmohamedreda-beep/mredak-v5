from elevenlabs.client import ElevenLabs

# Ta clé MRK Agency (elle fonctionne !)
client = ElevenLabs(api_key="sk_9c3e02798cd66c579cc109cf8d7814a884497e1e96cf01c41")

try:
    print("⏳ Étape 1 : Connexion au Voice Lab...")
    v_list = client.voices.get_all()
    ma_voix = v_list.voices[0]
    print(f"✅ Voix trouvée : {ma_voix.name}")

    print("🎙️ Étape 2 : Génération de l'audio...")
    audio_gen = client.text_to_speech.convert(
        voice_id=ma_voix.voice_id,
        text="مرحباً رضا، تم تفعيل نظام وكالة إم آر كي بنجاح على جهازك ماك ميني. الجودة رائعة جداً",
        model_id="eleven_multilingual_v3"
    )

    print("💾 Étape 3 : Sauvegarde du fichier...")
    with open("test_reda_premium.mp3", "wb") as f:
        for chunk in audio_gen:
            f.write(chunk)

    print("---")
    print("🚀 TERMINÉ ! Le fichier 'test_reda_premium.mp3' est créé.")

except Exception as e:
    print(f"❌ Erreur : {e}")