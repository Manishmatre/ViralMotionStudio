import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  AnimatedHeading,
  AnimatedStatistics,
  BrandLogoMark,
  CinematicScene,
  FinancialChart,
  GeographicMapAnimation,
  KineticTypography,
  ParallaxLayer,
  VideoComposition,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import type { Storyboard, StoryboardScene, ThemePalette } from "../types/video";
import { EDITORIAL_EASE } from "../utils/motion";
import { TEMPLATE_PRESETS } from "./presets";

const DEFAULT_PHOTO_BY_CATEGORY: Record<string, string> = {
  "business-stories": "assets/scenes/manhattan-skyline.jpg",
  "billionaire-facts": "assets/scenes/trading-atrium.jpg",
  "ai-technology": "assets/scenes/datacenter-corridor.jpg",
  "psychology-facts": "assets/scenes/manhattan-skyline.jpg",
  "geography-explained": "assets/scenes/singapore-port.jpg",
  "motivational-stories": "assets/scenes/garage-origin.jpg",
  "interesting-facts": "assets/scenes/silicon-wafer.jpg",
  "financial-education": "assets/scenes/trading-atrium.jpg",
};

const GenericStoryboardScene: React.FC<{
  readonly scene: StoryboardScene;
  readonly theme: ThemePalette;
  readonly defaultPhoto: string;
}> = ({ scene, theme, defaultPhoto }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const photo = scene.photoAsset ?? defaultPhoto;

  return (
    <CinematicScene
      photoSrc={photo}
      cameraMovement={scene.type === "hook" ? "dolly-in" : "pan-right"}
      accentColor={theme.accent}
      bgColor={theme.bgPrimary}
      padding="140px 72px 280px 72px"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          opacity: fadeIn,
        }}
      >
        <ParallaxLayer depth={1.15}>
          <AnimatedHeading
            eyebrow={scene.eyebrow}
            title={scene.headline}
            subtitle={scene.subheadline}
            highlightWords={scene.accentWords}
            accentColor={theme.accent}
            textColor={theme.textPrimary}
            mutedColor={theme.textMuted}
            fontFamily={theme.headingFont}
            bodyFontFamily={theme.bodyFont}
            fontSize={scene.type === "hook" ? 88 : 74}
            variant={scene.type === "hook" ? "tilt-3d" : "mask-up"}
          />
        </ParallaxLayer>

        {scene.metric ? (
          <ParallaxLayer depth={1.35}>
            <AnimatedStatistics
              accentColor={theme.accent}
              textColor={theme.textPrimary}
              columns={1}
              items={[
                {
                  label: scene.metric.caption ?? "VERIFIED DATA POINT",
                  value: scene.metric.value,
                  prefix: scene.metric.prefix,
                  suffix: scene.metric.suffix,
                  decimals: scene.metric.decimals ?? 1,
                  delta: scene.metric.delta,
                },
              ]}
            />
          </ParallaxLayer>
        ) : null}

        {scene.chartData && scene.chartData.length > 0 ? (
          <FinancialChart
            data={scene.chartData}
            accentColor={theme.accent}
            mode={scene.type === "stat-reveal" ? "area-curve" : "pillars"}
            height={520}
          />
        ) : null}

        {scene.mapData ? (
          <GeographicMapAnimation
            markers={scene.mapData.markers}
            arcs={scene.mapData.arcs}
            accentColor={theme.accent}
            focusCenter={scene.mapData.focusCenter ?? [480, 210]}
            zoom={scene.mapData.zoom ?? 1.25}
            height={560}
          />
        ) : null}

        {scene.type === "outro" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <BrandLogoMark size={74} />
            <KineticTypography
              lines={[
                [
                  { text: "FOLLOW", highlight: true },
                  { text: "FOR" },
                  { text: "PART" },
                  { text: "2", highlight: true },
                ],
              ]}
              fontFamily={theme.headingFont}
              accentColor={theme.accent}
              textColor={theme.textPrimary}
              baseFontSize={60}
              delayFrames={10}
            />
          </div>
        ) : null}
      </div>
    </CinematicScene>
  );
};

export const TemplateVideo: React.FC<{
  readonly storyboard: Storyboard;
  readonly muted?: boolean;
}> = ({ storyboard, muted = false }) => {
  const theme = TEMPLATE_PRESETS[storyboard.category];
  const defaultPhoto =
    DEFAULT_PHOTO_BY_CATEGORY[storyboard.category] ?? "assets/scenes/manhattan-skyline.jpg";

  const scenes: CompositionSceneItem[] = storyboard.scenes.map((scene, idx) => ({
    id: scene.id,
    name: scene.title,
    durationInFrames: scene.durationInFrames,
    transitionAfter: idx % 2 === 0 ? "depth-push" : "slide-left",
    transitionDuration: 12,
    element: (
      <GenericStoryboardScene
        scene={scene}
        theme={theme}
        defaultPhoto={defaultPhoto}
      />
    ),
  }));

  return (
    <VideoComposition
      theme={theme}
      scenes={scenes}
      captions={storyboard.captions}
      sfxCues={storyboard.sfxCues}
      muted={muted}
      showHudOverlay={storyboard.visualStyle === "futuristic-hud"}
      hudLeftLabel={`ENGINE // ${storyboard.visualStyle.toUpperCase()}`}
      hudRightLabel={`${storyboard.width}x${storyboard.height}`}
    />
  );
};
