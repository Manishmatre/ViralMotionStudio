import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CinematicScene,
  DataStream,
  NetworkConnection,
  WorkflowNode,
  type BezierCurveSpec,
} from "../components";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

export type NodeSpec = {
  readonly id: string;
  readonly indexLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly x: number;
  readonly y: number;
  readonly delayFrames: number;
  readonly state: "pending" | "active" | "complete";
  readonly accentColor?: string;
  readonly icon?: React.ReactNode;
};

type ExplainerPipelineGraphProps = {
  readonly nodes: readonly NodeSpec[];
  readonly edges: readonly {
    readonly fromId: string;
    readonly toId: string;
    readonly delayFrames: number;
    readonly color?: string;
    readonly showStream?: boolean;
  }[];
  readonly stageWidth?: number;
  readonly stageHeight?: number;
  readonly accentColor?: string;
};

/**
 * Engine B — Connected System Pipeline Canvas:
 * Renders precision workflow nodes joined by progressive cubic Bezier conduits and deterministic data particles.
 */
export const ExplainerPipelineGraph: React.FC<ExplainerPipelineGraphProps> = ({
  nodes,
  edges,
  stageWidth = 940,
  stageHeight = 700,
  accentColor = "#22D3EE",
}) => {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ position: "relative", width: stageWidth, height: stageHeight, margin: "0 auto" }}>
      <svg
        viewBox={`0 0 ${stageWidth} ${stageHeight}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        {edges.map((edge) => {
          const from = byId.get(edge.fromId);
          const to = byId.get(edge.toId);
          if (!from || !to) return null;

          const dx = Math.abs(to.x - from.x) * 0.45;
          const dy = Math.abs(to.y - from.y) * 0.45;
          const horizontal = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);

          const curve: BezierCurveSpec = horizontal
            ? {
                x0: from.x,
                y0: from.y,
                cx1: from.x + (to.x > from.x ? dx : -dx),
                cy1: from.y,
                cx2: to.x - (to.x > from.x ? dx : -dx),
                cy2: to.y,
                x1: to.x,
                y1: to.y,
              }
            : {
                x0: from.x,
                y0: from.y,
                cx1: from.x,
                cy1: from.y + dy,
                cx2: to.x,
                cy2: to.y - dy,
                x1: to.x,
                y1: to.y,
              };

          return (
            <React.Fragment key={`${edge.fromId}-${edge.toId}`}>
              <NetworkConnection
                curve={curve}
                delayFrames={edge.delayFrames}
                durationFrames={20}
                color={edge.color ?? accentColor}
              />
              {edge.showStream !== false ? (
                <DataStream
                  curve={curve}
                  startFrame={edge.delayFrames + 12}
                  color={edge.color ?? accentColor}
                  particleCount={3}
                  cycleFrames={44}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </svg>

      {nodes.map((node) => (
        <WorkflowNode
          key={node.id}
          indexLabel={node.indexLabel}
          title={node.title}
          subtitle={node.subtitle}
          x={node.x}
          y={node.y}
          state={node.state}
          accentColor={node.accentColor ?? accentColor}
          delayFrames={node.delayFrames}
          icon={node.icon}
        />
      ))}
    </div>
  );
};

type ExplainerBackdropProps = {
  readonly children: React.ReactNode;
  readonly photoSrc?: string;
  readonly accentColor?: string;
  readonly padding?: string | number;
};

/**
 * Engine B — Master Futuristic Explainer Environment:
 * Combines subtle obsidian data-center architectural depth + precision wireframe grid + LightSweep.
 */
export const ExplainerStage: React.FC<ExplainerBackdropProps> = ({
  children,
  photoSrc = "assets/scenes/datacenter-corridor.jpg",
  accentColor = "#8247FF",
  padding = "120px 72px 260px 72px",
}) => {
  return (
    <CinematicScene
      photoSrc={photoSrc}
      revealMode="curtain-vertical"
      cameraMovement="dolly-in"
      accentColor={accentColor}
      padding={padding}
      overlayGradient="linear-gradient(180deg, rgba(7,9,22,0.92) 0%, rgba(10,14,34,0.78) 50%, rgba(7,9,22,0.96) 100%)"
      photoFilter="contrast(1.08) saturate(0.85) brightness(0.6)"
    >
      {children}
    </CinematicScene>
  );
};

type AudioWaveformBarProps = {
  readonly accentColor?: string;
  readonly barCount?: number;
  readonly height?: number;
  readonly label?: string;
};

/**
 * Deterministic voiceover waveform equalizer bar visualizer for Explainer Audio stages.
 */
export const ExplainerAudioWaveform: React.FC<AudioWaveformBarProps> = ({
  accentColor = "#22D3EE",
  barCount = 34,
  height = 84,
  label = "NEURAL VOICEOVER + SFX TRACK MIX",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const reveal = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "16px 22px",
        background: "rgba(11, 15, 34, 0.88)",
        border: `1px solid ${accentColor}44`,
        borderRadius: 12,
        opacity: reveal,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: accentColor, letterSpacing: "0.1em" }}>
          {label}
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#10B981" }}>
          24kHz · WORD-SYNCED
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 5,
          height,
        }}
      >
        {Array.from({ length: barCount }, (_, i) => {
          const wave =
            0.25 +
            0.75 *
              Math.abs(Math.sin(t * 7.2 + i * 0.45) * Math.cos(t * 2.8 - i * 0.18));
          const barH = Math.max(8, height * wave * reveal);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: barH,
                borderRadius: 3,
                background: i % 3 === 0 ? "#8247FF" : accentColor,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

