import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

type SoundName = 'scan' | 'card' | 'success';
type Tone = { frequency: number; start: number; duration: number };
const tones: Record<SoundName, Tone[]> = {
  scan: [{ frequency: 1150, start: 0, duration: 0.09 }],
  card: [{ frequency: 1050, start: 0, duration: 0.09 }, { frequency: 1050, start: 0.18, duration: 0.09 }],
  success: [{ frequency: 523, start: 0, duration: 0.12 }, { frequency: 659, start: 0.12, duration: 0.12 }, { frequency: 784, start: 0.24, duration: 0.22 }],
};
let webContext: any = null;
let webConstructor: any = null;
let initialization: Promise<void> | null = null;
let disposed = false;
const nativeSounds: Partial<Record<SoundName, Audio.Sound>> = {};

export function configureWebAudio(constructor: any) { webConstructor = constructor; disposed = false; }
function encodeBase64(bytes: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = bytes[i + 1] || 0, c = bytes[i + 2] || 0;
    result += alphabet[a >> 2] + alphabet[((a & 3) << 4) | (b >> 4)] +
      (i + 1 < bytes.length ? alphabet[((b & 15) << 2) | (c >> 6)] : '=') +
      (i + 2 < bytes.length ? alphabet[c & 63] : '=');
  }
  return result;
}
function createWav(sequence: Tone[]): string {
  const rate = 22050;
  const length = Math.ceil((Math.max(...sequence.map(t => t.start + t.duration)) + 0.03) * rate);
  const bytes = new Uint8Array(44 + length * 2);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) bytes[offset + i] = value.charCodeAt(i); };
  text(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true);
  view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, length * 2, true);
  for (let i = 0; i < length; i++) {
    const time = i / rate;
    let sample = 0;
    for (const tone of sequence) {
      const elapsed = time - tone.start;
      if (elapsed >= 0 && elapsed < tone.duration) {
        const envelope = Math.min(1, elapsed / 0.006, (tone.duration - elapsed) / 0.02);
        sample += Math.sin(2 * Math.PI * tone.frequency * elapsed) * envelope * 0.26;
      }
    }
    view.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, sample * 32767)), true);
  }
  return encodeBase64(bytes);
}
export async function prepareAudio(): Promise<void> {
  disposed = false;
  if (Platform.OS === 'web') return;
  if (initialization) return initialization;
  initialization = (async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false, shouldDuckAndroid: false });
    for (const name of ['scan', 'card', 'success'] as SoundName[]) {
      const base64 = createWav(tones[name]);
      const uri = `${FileSystem.cacheDirectory}little-register-${name}.wav`;
      await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
      if (disposed) return;
      const { sound } = await Audio.Sound.createAsync({ uri });
      if (disposed) { await sound.unloadAsync(); return; }
      nativeSounds[name] = sound;
    }
  })().catch(() => { initialization = null; });
  return initialization;
}
export function unlockAudio(): void {
  if (Platform.OS !== 'web') { void prepareAudio(); return; }
  try {
    if (!webContext && webConstructor) webContext = new webConstructor();
    if (webContext?.state === 'suspended') void webContext.resume().catch(() => {});
  } catch { /* Sound availability never blocks the game. */ }
}
export function playSound(name: SoundName): void {
  unlockAudio();
  if (Platform.OS === 'web') {
    if (!webContext) return;
    try {
      const start = webContext.currentTime + 0.015;
      for (const tone of tones[name]) {
        const oscillator = webContext.createOscillator();
        const gain = webContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = tone.frequency;
        const at = start + tone.start;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(0.22, at + 0.006);
        gain.gain.setValueAtTime(0.22, at + Math.max(0.007, tone.duration - 0.02));
        gain.gain.linearRampToValueAtTime(0, at + tone.duration);
        oscillator.connect(gain); gain.connect(webContext.destination);
        oscillator.start(at); oscillator.stop(at + tone.duration + 0.01);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      }
    } catch { /* Audio is optional if a platform denies playback. */ }
    return;
  }
  void prepareAudio().then(() => { if (!disposed) void nativeSounds[name]?.replayAsync().catch(() => {}); });
}
export function releaseAudio(): void {
  disposed = true;
  for (const name of Object.keys(nativeSounds) as SoundName[]) {
    void nativeSounds[name]?.unloadAsync().catch(() => {});
    delete nativeSounds[name];
  }
  if (webContext) { void webContext.close().catch(() => {}); webContext = null; }
  initialization = null;
}
