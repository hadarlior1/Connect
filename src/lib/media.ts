import { MODULE_INTROS, STEP_VIDEOS } from "../content/videos";

// Media locations (files live under /public).
// Narrator orb (no on-screen presenter): a single round image that glows with the voice level.
export const TALK_FRAMES = ["/brand/voice.webp"];

export function screenUrl(id: string): string {
  return `/screens/${id}.jpg`;
}

/** Silent screen recording shown in place of the screenshot (steps with `clip`). */
export function clipUrl(id: string): string {
  return `/clips/${id}.mp4`;
}

/** The module's opening video, or undefined when none was recorded. */
export function moduleIntroUrl(moduleId: string): string | undefined {
  return MODULE_INTROS.includes(moduleId) ? avatarVideoUrl(`m${moduleId}`) : undefined;
}

/** True when the step has its own recorded avatar video. */
export function hasStepVideo(id: string): boolean {
  return STEP_VIDEOS.includes(id);
}

// Transparent-background WebM (VP9 alpha) where supported; Safari gets the MP4 (black background).
function preferWebm(): boolean {
  if (typeof document === "undefined" || typeof navigator === "undefined") return false;
  if (/Apple/.test(navigator.vendor ?? "")) return false;
  try {
    return document.createElement("video").canPlayType('video/webm; codecs="vp9"') !== "";
  } catch {
    return false;
  }
}

export function avatarVideoUrl(id: string): string {
  if (preferWebm()) return `/avatar/${id}.webm`;
  return `/avatar/${id}.mp4`;
}
