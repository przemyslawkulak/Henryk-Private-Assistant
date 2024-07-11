// src/app/audio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { openAIKey } from '../../variables';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private onStopSubject: Subject<Blob> = new Subject();
  private audioChunks: Blob[] = [];


  constructor(private http: HttpClient) {}

  get onStop(): Observable<Blob> {
    return this.onStopSubject.asObservable();
  }

  async startRecording() {
    const constraints = {
      audio: {
        sampleRate: 48000,
        channelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        audioBitsPerSecond: 128000
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.onStopSubject.next(audioBlob);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }


  sendAudio(view: Blob): Observable<{text: string}> {
    let blob = new Blob([view], { type: 'audio/wav' });

    let formData = new FormData();
    formData.append('file', blob, 'voice.wav');
    formData.append('model', 'whisper-1');

    const headers = new HttpHeaders({
      Authorization:
        `Bearer ${openAIKey}`,
    });

    return this.http
      .post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers,
      }) as Observable<{text: string}>

  }
}
