from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)  # This will allow all domains by default

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    #audio = AudioSegment.from_wav("input.wav")

    #start_time = 0  # 5 seconds
    #end_time = 4000   # 15 seconds

    # Trim the audio
    #trimmed_audio = audio[start_time:end_time]
    #trimmed_audio.export(file.filename, format="wav")

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file to a directory
    save_path = os.path.join('uploads', file.filename)
    file.save(save_path)
    #trimmed_audio.export(save_path, format="wav")
    

    return jsonify({"message": f"File {file.filename} uploaded successfully."})


if __name__ == '__main__':
    # Ensure the 'uploads' directory exists
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True, host='127.0.0.1', port=5000)
