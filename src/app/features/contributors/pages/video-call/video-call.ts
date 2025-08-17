import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './video-call.html',
  styleUrls: ['./video-call.css']
})
export class VideoCall implements OnDestroy, AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('screenVideo') screenVideo!: ElementRef<HTMLVideoElement>;

  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;
  public screenStream: MediaStream | null = null;
  public peerConnection: RTCPeerConnection | null = null;

  public isFullscreen = false;
  public isSharingScreen = false;
  public isMuted = false;
  public isVideoOff = false;
  public isCallActive = false;
  public isRemoteConnected = false;
  public showChat = false;
  public callDuration = '00:00';
  public newMessage = '';
  public messages: { text: string, isMe: boolean }[] = [];

  private callTimer: any;
  private iceCandidates: RTCIceCandidate[] = [];

  private readonly config: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  ngAfterViewInit() {
    this.setupVideoElements();
  }

  private setupVideoElements() {
    if (this.remoteVideo) {
      this.remoteVideo.nativeElement.onloadedmetadata = () => {
        this.isRemoteConnected = true;
      };
      this.remoteVideo.nativeElement.onerror = (err) => {
        console.error('Erreur vidéo distante:', err);
        this.isRemoteConnected = false;
      };
    }
  }

  async startCall() {
    try {
      // Initialiser les flux média locaux
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      this.updateVideoStream(this.localStream);
      this.isCallActive = true;
      this.isRemoteConnected = false;
      this.startCallTimer();
      this.setupPeerConnection();

      // Simuler une connexion distante après 2 secondes
      setTimeout(() => {
        if (!this.isRemoteConnected) {
          this.simulateRemoteConnection();
        }
      }, 2000);

    } catch (error) {
      console.error('Erreur démarrage appel:', error);
      this.handleCallError(error);
    }
  }

  private simulateRemoteConnection() {
    if (!this.localStream) return;

    // Affichage distant identique à local (simulation)
    this.remoteStream = this.localStream;

    if (this.remoteVideo?.nativeElement) {
      this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      this.remoteVideo.nativeElement.play().catch(e => console.error(e));
    }

    this.isRemoteConnected = true;
  }

  private updateVideoStream(stream: MediaStream) {
    if (this.localVideo?.nativeElement) {
      this.localVideo.nativeElement.srcObject = stream;
      this.localVideo.nativeElement.play().catch(e => console.error('Erreur lecture vidéo locale:', e));
    }
  }

  private setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.config);

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream as MediaStream);
      });
    }

    this.remoteStream = new MediaStream();
    if (this.remoteVideo?.nativeElement) {
      this.remoteVideo.nativeElement.srcObject = this.remoteStream;
    }

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream?.addTrack(track);
        });
        this.remoteVideo?.nativeElement.play().catch(e => console.error('Erreur lecture vidéo distante:', e));
        this.isRemoteConnected = true;
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) this.iceCandidates.push(event.candidate);
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection?.iceConnectionState === 'connected') this.isRemoteConnected = true;
      else if (this.peerConnection?.iceConnectionState === 'disconnected') this.isRemoteConnected = false;
    };
  }

  async toggleScreenShare() {
    if (this.isSharingScreen) this.stopScreenShare();
    else await this.startScreenShare();
  }

  async startScreenShare() {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30 } }, audio: false });

      // Affichage uniquement local
      if (this.screenVideo?.nativeElement) {
        this.screenVideo.nativeElement.srcObject = this.screenStream;
        await this.screenVideo.nativeElement.play().catch(err => console.error("Erreur lecture écran:", err));
      }

      this.isSharingScreen = true;

      // Fin du partage
      this.screenStream.getVideoTracks()[0].onended = () => this.stopScreenShare();

    } catch (error) {
      console.error('Erreur partage écran:', error);
      this.isSharingScreen = false;
    }
  }

  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      if (this.screenVideo?.nativeElement) this.screenVideo.nativeElement.srcObject = null;
    }
    this.isSharingScreen = false;
    this.screenStream = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.localStream?.getAudioTracks().forEach(track => track.enabled = !this.isMuted);
  }

  toggleVideo() {
    this.isVideoOff = !this.isVideoOff;
    this.localStream?.getVideoTracks().forEach(track => track.enabled = !this.isVideoOff);
  }

  toggleFullscreen() {
    if (!this.isFullscreen) this.videoContainer.nativeElement.requestFullscreen().catch(err => console.error('Erreur fullscreen:', err));
    else document.exitFullscreen();
    this.isFullscreen = !this.isFullscreen;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, isMe: true });
      this.newMessage = '';
    }
  }

  private startCallTimer() {
    let seconds = 0;
    this.callTimer = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.callDuration = `${minutes.toString().padStart(2,'0')}:${remainingSeconds.toString().padStart(2,'0')}`;
    }, 1000);
  }

  endCall() {
    this.peerConnection?.close();
    this.peerConnection = null;

    this.localStream?.getTracks().forEach(track => track.stop());
    this.remoteStream?.getTracks().forEach(track => track.stop());
    this.screenStream?.getTracks().forEach(track => track.stop());

    if (this.callTimer) clearInterval(this.callTimer);
    this.callTimer = null;

    this.isCallActive = false;
    this.isRemoteConnected = false;
    this.isSharingScreen = false;
    this.callDuration = '00:00';

    if (this.localVideo?.nativeElement) this.localVideo.nativeElement.srcObject = null;
    if (this.remoteVideo?.nativeElement) this.remoteVideo.nativeElement.srcObject = null;
    if (this.screenVideo?.nativeElement) this.screenVideo.nativeElement.srcObject = null;
  }

  private handleCallError(error: any) {
    console.error('Erreur d\'appel:', error);
    this.endCall();
  }

  ngOnDestroy() {
    this.endCall();
  }
}
