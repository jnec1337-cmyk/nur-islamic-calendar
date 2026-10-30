let ctx: AudioContext | null = null;

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(
  context: AudioContext,
  freq: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(gainValue, start + 0.04);
  gain.gain.setValueAtTime(gainValue, start + Math.max(0.05, duration - 0.08));
  gain.gain.linearRampToValueAtTime(0, start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export async function playSoft() {
  const context = audio();
  await context.resume();
  const t = context.currentTime + 0.02;
  tone(context, 392, t, 0.38, 0.04, "sine");
  tone(context, 494, t + 0.42, 0.55, 0.035, "sine");
}

export async function playCall() {
  const context = audio();
  await context.resume();
  const t = context.currentTime + 0.02;
  const notes = [330, 349, 330, 294, 330, 392, 349, 330];
  notes.forEach((freq, index) => {
    tone(context, freq, t + index * 0.52, 0.46, 0.042, "triangle");
  });
}

export function pulse(pattern: number | number[] = 20) {
  navigator.vibrate?.(pattern);
}
