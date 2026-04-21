from elevenlabs.client import ElevenLabs

# Ta clé qui fonctionne !
CLE = "sk_7b9ba80e8e3ddad4a589d5b953846162ae67848ad55f3121"

client = ElevenLabs(api_key=CLE.strip())

try:
    print("🚀 Connexion validée. Génération du fichier...")
    
    # On utilise Roger (ou la 1ère voix de ton labo)
    v_list = client.voices.get_all()
    ma_voix = v_list.voices[0]
    
    print(f"🎙️ Utilisation de la voix : {ma_voix.name}")

    # On passe en v2 pour une compatibilité totale immédiate
    audio_gen = client.text_to_speech.convert(
        voice_id=ma_voix.voice_id,
        text="مرحباً رضا، مبروك ! نظامك يعمل الآن بالكامل على ماك ميني. هذه هي البداية فقط",
        model_id="eleven_multilingual_v2", 
        output_format="mp3_44100_128"
    )

    with open("succes_reda.mp3", "wb") as f:
        for chunk in audio_gen:
            f.write(chunk)

    print("---")
    print("🔥 VICTOIRE TOTALE ! Le fichier 'succes_reda.mp3' est créé.")
    print("Regarde à gauche dans Cursor et écoute-le !")

except Exception as e:
    print(f"❌ Erreur : {e}")