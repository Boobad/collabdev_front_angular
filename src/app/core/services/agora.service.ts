import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  UID
} from 'agora-rtc-sdk-ng';

@Injectable({ providedIn: 'root' })
export class AgoraService {
  private client: IAgoraRTCClient;
  private localTracks: {
    audioTrack?: ILocalAudioTrack;
    videoTrack?: ILocalVideoTrack;
  } = {};
  private screenTrack?: ILocalVideoTrack;

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8', role: 'host' });
  }

  async join(appId: string, channel: string, token: string | null, uid: UID) {
    await this.client.join(appId, channel, token || null, uid);

    this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '1080p_1' });

    const tracksToPublish = [];
    if (this.localTracks.audioTrack) tracksToPublish.push(this.localTracks.audioTrack);
    if (this.localTracks.videoTrack) tracksToPublish.push(this.localTracks.videoTrack);

    await this.client.publish(tracksToPublish);

    return {
      videoTrack: this.localTracks.videoTrack,
      audioTrack: this.localTracks.audioTrack
    };
  }

  async startScreenShare(): Promise<ILocalVideoTrack> {
    const screenTrackOrTracks = await AgoraRTC.createScreenVideoTrack({
      encoderConfig: '1080p_1',
      optimizationMode: 'detail'
    });

    if (Array.isArray(screenTrackOrTracks)) {
      this.screenTrack = screenTrackOrTracks[0];
      if (screenTrackOrTracks[1]) {
        this.localTracks.audioTrack = screenTrackOrTracks[1];
      }
    } else {
      this.screenTrack = screenTrackOrTracks;
    }

    if (this.localTracks.videoTrack) {
      await this.client.unpublish([this.localTracks.videoTrack]);
    }

    await this.client.publish([this.screenTrack]);
    return this.screenTrack;
  }

  async stopScreenShare() {
    if (this.screenTrack) {
      await this.client.unpublish([this.screenTrack]);
      this.screenTrack.close();
      this.screenTrack = undefined;
    }

    if (this.localTracks.videoTrack) {
      await this.client.publish([this.localTracks.videoTrack]);
    }
  }

  async enableLocalAudio(enabled: boolean) {
    if (this.localTracks.audioTrack) await this.localTracks.audioTrack.setEnabled(enabled);
  }

  async enableLocalVideo(enabled: boolean) {
    if (this.localTracks.videoTrack) await this.localTracks.videoTrack.setEnabled(enabled);
  }

  playLocalVideo(element: HTMLElement) {
    this.localTracks.videoTrack?.play(element);
  }

  async leave() {
    this.localTracks.audioTrack?.close();
    this.localTracks.videoTrack?.close();
    if (this.screenTrack) this.screenTrack.close();
    await this.client.leave();
    this.localTracks = {};
    this.screenTrack = undefined;
  }

  getClient() {
    return this.client;
  }
}
