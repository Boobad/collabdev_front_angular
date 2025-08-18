import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faDesktop, faPhone, faPhoneSlash, faCopy, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AgoraService } from '../../../../core/services/agora.service';
import { IAgoraRTCRemoteUser, ILocalVideoTrack, ILocalAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack, UID } from 'agora-rtc-sdk-ng';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface RemoteUser {
  uid: string | number;
  username?: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './video-call.html',
  styleUrls: ['./video-call.css']
})
export class VideoCall implements AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videosContainer') videosContainer!: ElementRef<HTMLDivElement>;

  icons = {
    mic: faMicrophone,
    micMute: faMicrophoneSlash,
    video: faVideo,
    videoMute: faVideoSlash,
    screen: faDesktop,
    call: faPhone,
    endCall: faPhoneSlash,
    copy: faCopy,
    addUser: faUserPlus
  };

  // États principaux
  isSharingScreen: boolean = false;
  isCallActive = false;
  isScreenSharing = false;
  localVideoEnabled = true;
  localAudioEnabled = true;
  isMuted = false;
  isVideoOff = false;
  showChat = false;
  callDuration = '00:00';
  isRemoteConnected = false;
  showMeetingForm = false;
  meetingCode = '';
  meetingLink = '';
  isCreatingMeeting = false;
  isJoiningMeeting = false;

  // Chat
  messages: { text: string; isMe?: boolean }[] = [];
  newMessage: string = '';

  remoteUsers: RemoteUser[] = [];
  buttonClasses = "w-14 h-14 rounded-full text-white flex items-center justify-center text-xl transition-all";

  private localVideoTrack?: ILocalVideoTrack;
  private localAudioTrack?: ILocalAudioTrack;
  private intervalId: any;

  constructor(
    private agoraService: AgoraService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.arrangeVideos();
  }

  toggleFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error('Erreur fullscreen:', err));
    } else {
      document.exitFullscreen().catch(err => console.error('Erreur exit fullscreen:', err));
    }
  }

  generateMeetingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createMeeting() {
    if (!this.meetingCode) {
      this.meetingCode = this.generateMeetingCode();
    }
    this.isCreatingMeeting = true;
    this.meetingLink = `${window.location.origin}/join/${this.meetingCode}`;
    await this.startCall(this.meetingCode);
    this.isCreatingMeeting = false;
  }

  async joinMeeting() {
    if (!this.meetingCode.trim()) {
      this.snackBar.open('Veuillez entrer un code de réunion', 'OK', { duration: 3000 });
      return;
    }
    
    this.isJoiningMeeting = true;
    await this.startCall(this.meetingCode);
    this.isJoiningMeeting = false;
  }

  copyMeetingLink() {
    navigator.clipboard.writeText(this.meetingLink)
      .then(() => {
        this.snackBar.open('Lien copié dans le presse-papiers', 'OK', { duration: 3000 });
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
        this.snackBar.open('Échec de la copie du lien', 'OK', { duration: 3000 });
      });
  }

  async startCall(channel: string) {
    try {
      const uid = Math.floor(Math.random() * 10000);
      const localTracks = await this.agoraService.join('9e4dd65eea304ef0a878526bc8fa8ae6', channel, null, uid);

      this.localVideoTrack = localTracks.videoTrack!;
      this.localAudioTrack = localTracks.audioTrack!;

      if (this.localVideoEnabled) this.agoraService.playLocalVideo(this.localVideo.nativeElement);

      this.setupEventListeners();
      this.isCallActive = true;
      this.startTimer();
    } catch (err) {
      console.error('Erreur démarrage appel:', err);
      this.snackBar.open('Échec de connexion à la réunion', 'OK', { duration: 3000 });
      this.isCreatingMeeting = false;
      this.isJoiningMeeting = false;
    }
  }

  private startTimer() {
    let seconds = 0;
    this.intervalId = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.callDuration = `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    }, 1000);
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private setupEventListeners() {
    const client = this.agoraService.getClient();

    client.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio' || mediaType === 'video') {
        await client.subscribe(user, mediaType);
        this.handleRemoteUser(user, mediaType, true);
        this.isRemoteConnected = true;
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio' || mediaType === 'video') {
        this.handleRemoteUser(user, mediaType, false);
      }
    });

    client.on('user-left', (user) => {
      this.remoteUsers = this.remoteUsers.filter(u => u.uid !== user.uid);
      this.arrangeVideos();
      if (this.remoteUsers.length === 0) this.isRemoteConnected = false;
    });
  }

  private handleRemoteUser(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video', isPublished: boolean) {
    const remoteUser = this.getOrCreateRemoteUser(user.uid);

    if (mediaType === 'video') {
      remoteUser.videoEnabled = isPublished;
      remoteUser.videoTrack = isPublished ? user.videoTrack as IRemoteVideoTrack : undefined;

      if (isPublished && user.videoTrack) {
        setTimeout(() => {
          const container = document.getElementById(`remote-${user.uid}`);
          if (container) user.videoTrack?.play(container);
        }, 100);
      }
    }

    if (mediaType === 'audio') {
      remoteUser.audioEnabled = isPublished;
      remoteUser.audioTrack = isPublished ? user.audioTrack as IRemoteAudioTrack : undefined;
      if (isPublished && user.audioTrack) user.audioTrack.play();
    }

    this.arrangeVideos();
  }

  private getOrCreateRemoteUser(uid: UID): RemoteUser {
    let user = this.remoteUsers.find(u => u.uid === uid);
    if (!user) {
      user = { uid, videoEnabled: false, audioEnabled: false, username: `User${Math.floor(Math.random() * 1000)}` };
      this.remoteUsers.push(user);
    }
    return user;
  }

  async toggleAudio() {
    this.localAudioEnabled = !this.localAudioEnabled;
    if (this.localAudioTrack) this.localAudioTrack.setEnabled(this.localAudioEnabled);
    this.isMuted = !this.localAudioEnabled;
  }

  async toggleVideo() {
    this.localVideoEnabled = !this.localVideoEnabled;
    if (this.localVideoTrack) this.localVideoTrack.setEnabled(this.localVideoEnabled);
    this.isVideoOff = !this.localVideoEnabled;
    if (this.localVideoEnabled && !this.isScreenSharing) {
      this.agoraService.playLocalVideo(this.localVideo.nativeElement);
    }
  }

  async toggleScreenShare() {
    this.isSharingScreen = !this.isSharingScreen;
    if (this.isSharingScreen) {
      await this.agoraService.startScreenShare();
      if (this.localVideoTrack) await this.localVideoTrack.setEnabled(false);
    } else {
      await this.agoraService.stopScreenShare();
      if (this.localVideoTrack) await this.localVideoTrack.setEnabled(true);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.localAudioTrack) this.localAudioTrack.setEnabled(!this.isMuted);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.messages.push({ text: this.newMessage, isMe: true });
    this.newMessage = '';
  }

  private arrangeVideos() {
    setTimeout(() => {
      const count = this.remoteUsers.length + 1;
      const container = this.videosContainer.nativeElement;
      if (count <= 2) container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow mb-4';
      else if (count <= 4) container.className = 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow mb-4';
      else container.className = 'grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 flex-grow mb-4';
    }, 0);
  }

  ngOnDestroy() {
    this.endCall();
  }

  async endCall() {
    if (this.intervalId) clearInterval(this.intervalId);
    await this.agoraService.leave();
    this.remoteUsers = [];
    this.isCallActive = false;
    this.isScreenSharing = false;
    this.isRemoteConnected = false;
    this.meetingCode = '';
    this.meetingLink = '';
  }
}