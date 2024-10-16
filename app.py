from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
import io
import os
from datetime import datetime
import speech_recognition as sr

app = Flask(__name__)
CORS(app)  # This will allow all domains by default
# Initialize the speech recognizer
recognizer = sr.Recognizer()
currLength = None
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400


    #audio = AudioSegment.from_wav("input.wav")

    #start_time = 0  # 5 seconds
    #end_time = 4000   # 15 seconds

    # Trim the audio
    #trimmed_audio = audio[start_time:end_time]
    #trimmed_audio.export(file.filename, format="wav")


    # Save the file to a directory
    save_path = os.path.join('uploads', file.filename)
    file.save(save_path)

    try:
        # Convert the audio file to PCM WAV format using pydub
        audio = AudioSegment.from_file(save_path)
        #start_time = 0  # 5 seconds
        #end_time = 4000   # 15 seconds

        # Trim the audio
        
        # global currLength
        # trimmed_audio = audio[currLength:]
        # currLength = len(audio)
        print("Audio Length: ", currLength)
        pcm_wav_path = os.path.splitext(save_path)[0] + "_converted.wav"
        audio.export(pcm_wav_path, format="wav", codec="pcm_s16le")

        # Transcribe the converted PCM WAV file
        print("Processing audio file...")

        # Load the converted PCM WAV file using SpeechRecognition
        with sr.AudioFile(pcm_wav_path) as source:
            audio_data = recognizer.record(source)
            # Perform the transcription
            transcription = recognizer.recognize_google(audio_data)
        
        # Print the transcription along with the current time
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"Time: {current_time}")
        print(f"Transcript:\n {transcription}")

        # Delete the original and converted audio files after transcription
        os.remove(save_path)
        os.remove(pcm_wav_path)

        return jsonify({
            "message": f"File {file.filename} uploaded, transcribed, and deleted successfully.",
            "transcription": transcription,
            "timestamp": current_time
        })
    except Exception as e:
        print("Error: ", str(e))
        # Handle transcription errors
        return jsonify({"error": str(e)}), 500

    



if __name__ == '__main__':
    # Ensure the 'uploads' directory exists
    print("Server Started")
    currLength = 0
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True, host='127.0.0.1', port=5000)
