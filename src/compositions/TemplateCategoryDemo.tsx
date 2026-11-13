import React from "react";
import { z } from "zod";
import { TemplateVideo } from "../templates/TemplateVideo";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { TemplateCategory } from "../types/video";
import { buildStoryboardFromScript } from "../workflows/scriptToStoryboard";

const CATEGORY_VALUES = [
  "business-stories",
  "billionaire-facts",
  "ai-technology",
  "psychology-facts",
  "geography-explained",
  "motivational-stories",
  "interesting-facts",
  "financial-education",
] as const;

export const TemplateDemoSchema = z.object({
  category: z.enum(CATEGORY_VALUES),
  topic: z.string(),
  headline: z.string(),
  statValue: z.number(),
  statSuffix: z.string(),
  muted: z.boolean(),
});

export type TemplateDemoProps = z.infer<typeof TemplateDemoSchema>;

export const TEMPLATE_DEMO_DURATION = 426;

export const TemplateCategoryDemo: React.FC<TemplateDemoProps> = ({
  category,
  topic,
  headline,
  statValue,
  statSuffix,
  muted,
}) => {
  const preset = TEMPLATE_PRESETS[category as TemplateCategory];
  const { storyboard } = buildStoryboardFromScript({
    id: `Template-${category}`,
    topic,
    category,
    visualStyle: preset.style,
    transitionOverlapFrames: 12,
    beats: [
      {
        id: "t-hook",
        title: "01 Hook",
        durationSeconds: 5,
        narration: headline,
        sceneSpec: {
          type: "hook",
          eyebrow: category.replace("-", " ").toUpperCase(),
          headline,
          subheadline: `Template preset: ${preset.style}`,
          sfx: "whoosh",
        },
      },
      {
        id: "t-stat",
        title: "02 Core Stat",
        durationSeconds: 5,
        narration: `${topic} hits ${statValue}${statSuffix} in global impact.`,
        sceneSpec: {
          type: "stat-reveal",
          eyebrow: "KEY METRIC",
          headline: topic,
          metric: {
            value: statValue,
            suffix: statSuffix,
            decimals: 1,
            caption: "Editable live inside Remotion Studio Props",
          },
          sfx: "shutter",
        },
      },
      {
        id: "t-outro",
        title: "03 Outro",
        durationSeconds: 5,
        narration: "Duplicate or customize this template for any viral short.",
        sceneSpec: {
          type: "outro",
          headline: "READY FOR PRODUCTION",
          sfx: "ding",
        },
      },
    ],
  });

  return <TemplateVideo storyboard={storyboard} muted={muted} />;
};

