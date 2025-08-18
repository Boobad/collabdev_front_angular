import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faDesktop, faPhone, faPhoneSlash, faCopy, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AgoraService } from '../../../../core/services/agora.service';
import { IAgoraRTCRemoteUser, ILocalVideoTrack, ILocalAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack, UID } from 'agora-rtc-sdk-ng';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface RemoteUser {
  uid: UID;
  username?: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  videoTrack?: IRemoteVideoTrack | ILocalVideoTrack;
  audioTrack?: IRemoteAudioTrack | ILocalAudioTrack;
}

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './video-call.html',
  styleUrls: ['./video-call.css']
})
export class VideoCall implements AfterViewInit, AfterViewChecked, OnDestroy {
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

  isSharingScreen = false;
  isCallActive = false;
  localVideoEnabled = true;
  localAudioEnabled = true;
  isMuted = false;
  isVideoOff = false;
  showChat = false;
  callDuration = '00:00';
  meetingCode = '';
  meetingLink = '';
  isCreatingMeeting = false;
  isJoiningMeeting = false;

  messages: { text: string; isMe?: boolean }[] = [];
  newMessage: string = '';

  remoteUsers: RemoteUser[] = [];

  private localVideoTrack?: ILocalVideoTrack;
  private localAudioTrack?: ILocalAudioTrack;
  private localUid?: UID;
  private intervalId: any;

  constructor(private agoraService: AgoraService, private snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    this.arrangeVideos();
    this.enterFullscreen();
  }

  ngAfterViewChecked() {
    this.remoteUsers.forEach(user => {
      if (user.videoEnabled && user.videoTrack) {
        const container = document.getElementById(`remote-${user.uid}`);
        if (container && container.childElementCount === 0) {
          user.videoTrack.play(container);
        }
      }
    });
  }

  private enterFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  }

  generateMeetingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  }

  async createMeeting() {
    if (!this.meetingCode) this.meetingCode = this.generateMeetingCode();
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
      .then(() => this.snackBar.open('Lien copié', 'OK', { duration: 3000 }))
      .catch(() => this.snackBar.open('Échec de la copie', 'OK', { duration: 3000 }));
  }

  private startTimer() {
    let seconds = 0;
    this.intervalId = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.callDuration = `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }, 1000);
  }

  private getOrCreateRemoteUser(uid: UID, isLocal = false): RemoteUser {
    let user = this.remoteUsers.find(u => u.uid === uid);
    if (!user) {
      user = {
        uid,
        username: isLocal ? 'Moi' : `User${Math.floor(Math.random() * 1000)}`,
        videoEnabled: isLocal ? this.localVideoEnabled : false,
        audioEnabled: isLocal ? this.localAudioEnabled : false,
        videoTrack: isLocal ? this.localVideoTrack : undefined,
        audioTrack: isLocal ? this.localAudioTrack : undefined
      };
      this.remoteUsers.push(user);
    }
    return user;
  }

  private async startCall(channel: string) {
    try {
      const uid = Math.floor(Math.random() * 10000);
      this.localUid = uid;

      const localTracks = await this.agoraService.join('9e4dd65eea304ef0a878526bc8fa8ae6', channel, null, uid);
      this.localVideoTrack = localTracks.videoTrack!;
      this.localAudioTrack = localTracks.audioTrack!;
      this.agoraService.playLocalVideo(this.localVideo.nativeElement);

      // Ajoute toi-même comme utilisateur
      this.getOrCreateRemoteUser(uid, true);

      this.isCallActive = true;
      this.setupEventListeners();
      this.startTimer();
    } catch (err) {
      console.error(err);
      this.snackBar.open('Échec de connexion', 'OK', { duration: 3000 });
      this.isCreatingMeeting = false;
      this.isJoiningMeeting = false;
    }
  }

  private setupEventListeners() {
    const client = this.agoraService.getClient();

    client.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio' || mediaType === 'video') {
        await client.subscribe(user, mediaType);

        // Gérer flux distant
        if (mediaType === 'video' && user.videoTrack) {
          const container = document.getElementById(`remote-${user.uid}`) || this.createRemoteContainer(user.uid);
          user.videoTrack.play(container);
        }

        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }

        this.handleRemoteUser(user, mediaType as 'audio' | 'video', true);
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio' || mediaType === 'video') {
        this.handleRemoteUser(user, mediaType as 'audio' | 'video', false);
      }
    });

    client.on('user-left', (user) => {
      this.remoteUsers = this.remoteUsers.filter(u => u.uid !== user.uid);
      this.arrangeVideos();
    });
  }

  private createRemoteContainer(uid: UID): HTMLDivElement {
    const container = document.createElement('div');
    container.id = `remote-${uid}`;
    container.className = 'remote-video';
    this.videosContainer.nativeElement.appendChild(container);
    return container;
  }

  private handleRemoteUser(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video', isPublished: boolean) {
    const remoteUser = this.getOrCreateRemoteUser(user.uid);
    if (mediaType === 'video') {
      remoteUser.videoEnabled = isPublished;
      remoteUser.videoTrack = isPublished ? user.videoTrack as IRemoteVideoTrack : undefined;
    }
    if (mediaType === 'audio') {
      remoteUser.audioEnabled = isPublished;
      remoteUser.audioTrack = isPublished ? user.audioTrack as IRemoteAudioTrack : undefined;
      if (isPublished && user.audioTrack) user.audioTrack.play();
    }
    this.arrangeVideos();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.localAudioTrack) this.localAudioTrack.setEnabled(!this.isMuted);
  }

  async toggleVideo() {
    this.localVideoEnabled = !this.localVideoEnabled;
    this.isVideoOff = !this.localVideoEnabled;
    if (this.localVideoTrack) this.localVideoTrack.setEnabled(this.localVideoEnabled);
    if (this.localVideoEnabled && !this.isSharingScreen) this.agoraService.playLocalVideo(this.localVideo.nativeElement);
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

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.messages.push({ text: this.newMessage, isMe: true });
    this.newMessage = '';
  }

  private arrangeVideos() {
    setTimeout(() => {
      const count = this.remoteUsers.length;
      const container = this.videosContainer.nativeElement;
      if (count <= 2) container.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
      else if (count <= 4) container.className = 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4';
      else container.className = 'grid grid-cols-3 lg:grid-cols-3 gap-4';
    }, 0);
  }

  async endCall() {
    if (this.intervalId) clearInterval(this.intervalId);
    await this.agoraService.leave();
    this.remoteUsers = [];
    this.isCallActive = false;
    this.isSharingScreen = false;
    this.meetingCode = '';
    this.meetingLink = '';
  }

  ngOnDestroy() {
    this.endCall();
  }
}
