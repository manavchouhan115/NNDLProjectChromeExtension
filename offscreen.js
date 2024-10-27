// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let audioChunks = [];
let backendURL = 'http://127.0.0.1:5000/upload';

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'start-recording':
        startRecording(message.data);
        break;
      case 'stop-recording':
        stopRecording();
        break;
      default:
        throw new Error('Unrecognized message:', message.type);
    }
  }
});

let recorder;
let data = [];
let recordingSessionId; // Variable to hold unique session ID

async function startRecording(streamId) {
  if (recorder?.state === 'recording') {
    throw new Error('Called startRecording while recording is in progress.');
  }
  recordingSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const media = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId
      }
    }
  });

  // Continue to play the captured audio to the user.
  const output = new AudioContext();
  const source = output.createMediaStreamSource(media);
  source.connect(output.destination);

  // Start recording.
  recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
    //recorder.ondataavailable = (event) => data.push(event.data);
    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            data.push(event.data);
            const blob = new Blob(data, { type: 'video/webm' });
            sendBlobToBackend(blob, recordingSessionId);
            //alert(data)
            //data=[]
        }
    }
  recorder.onstop = () => {
      //const blob = new Blob(data, { type: 'video/webm' });
      //sendBlobToBackend(blob);
    //window.open(URL.createObjectURL(blob), '_blank');

    // Clear state ready for next recording
    recorder = undefined;
    data = [];
    recordingSessionId = null; // Clear session ID for next recording
  };
    //recorder.start();
    recorder.start(10000)

  window.location.hash = 'recording';
}
let count = 0;
function sendBlobToBackend(blob, sessionId) {
    const formData = new FormData();
    formData.append("file", blob, "audio"+count+".wav"); // Append the blob with a filename
    formData.append("session_id", sessionId); // Add the session ID to the form data

    count++;
    fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => console.log("Success:", data))
        .catch(error => console.error("Error:", error));
}

async function stopRecording() {
  recorder.stop();

  // Stopping the tracks makes sure the recording icon in the tab is removed.
  recorder.stream.getTracks().forEach((t) => t.stop());

  // Update current state in URL
  window.location.hash = '';

}
