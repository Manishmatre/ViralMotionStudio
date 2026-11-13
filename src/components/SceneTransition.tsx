import {
  linearTiming,
  pushCut,
  springTiming,
  type TransitionPresentation,
  type TransitionTiming,
} from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { DepthTransition } from "./engine/EnvironmentAndScenes";

export type TransitionKind =
  | "fade"
  | "slide-left"
  | "slide-up"
  | "wipe-diagonal"
  | "push-cut"
  | "depth-push"
  | "flip"
  | "clock-wipe";

export const getTransitionPresentation = (
  kind: TransitionKind,
  width = 1080,
  height = 1920,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TransitionPresentation<any> => {
  switch (kind) {
    case "depth-push":
      return {
        component: DepthTransition,
        props: { direction: "push" },
      };
    case "slide-left":
      return slide({ direction: "from-right" });
    case "slide-up":
      return slide({ direction: "from-bottom" });
    case "wipe-diagonal":
      return wipe({ direction: "from-bottom-right" });
    case "push-cut":
      return pushCut({
        outgoingScale: 0.94,
        incomingStartScale: 1.08,
        incomingEndScale: 1,
        flashOpacity: 0.14,
      });
    case "flip":
      return flip({ direction: "from-right" });
    case "clock-wipe":
      return clockWipe({ width, height });
    case "fade":
    default:
      return fade();
  }
};

export const getTransitionTiming = (
  kind: TransitionKind,
  durationInFrames = 14,
): TransitionTiming => {
  if (kind === "push-cut" || kind === "slide-left" || kind === "slide-up") {
    return springTiming({
      config: { damping: 20, stiffness: 220 },
      durationInFrames,
      durationRestThreshold: 0.001,
    });
  }
  return linearTiming({ durationInFrames });
};

