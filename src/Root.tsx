import { Composition, Folder, Still } from "remotion";
import {
  AI_HUD_DURATION,
  AiAgentsHudSchema,
  AiAgentsHudTech,
} from "./compositions/AiAgentsHudTech";
import {
  GEO_SINGAPORE_DURATION,
  GeographySingaporeAnomaly,
  GeographySingaporeSchema,
} from "./compositions/GeographySingaporeAnomaly";
import {
  RICHEST_COMPANIES_DURATION,
  RichestCompaniesCinematic,
  RichestCompaniesSchema,
} from "./compositions/RichestCompaniesCinematic";
import {
  LONG_FORM_DURATION,
  LongFormSchema,
  RichestCompaniesLongForm,
} from "./compositions/RichestCompaniesLongForm";
import {
  TEMPLATE_DEMO_DURATION,
  TemplateCategoryDemo,
  TemplateDemoSchema,
} from "./compositions/TemplateCategoryDemo";
import {
  ThumbnailComposition,
  ThumbnailSchema,
} from "./compositions/ThumbnailCompositions";
import {
  WORKFLOW_EXPLAINER_DURATION,
  WorkflowAutomationExplainer,
  WorkflowAutomationSchema,
} from "./compositions/WorkflowAutomationExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RichestCompaniesCinematic"
        component={RichestCompaniesCinematic}
        durationInFrames={RICHEST_COMPANIES_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={RichestCompaniesSchema}
        defaultProps={{
          hookEyebrow: "GLOBAL CAPITAL // CINEMATIC BRIEF",
          hookHeadline: "FIVE COMPANIES WORTH MORE THAN ENTIRE CONTINENTS",
          combinedTrillions: 15.2,
          accentColor: "#D4AF37",
          muted: false,
        }}
      />

      <Composition
        id="AiAgentsHudTech"
        component={AiAgentsHudTech}
        durationInFrames={AI_HUD_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={AiAgentsHudSchema}
        defaultProps={{
          headline: "WHY AI AGENTS WILL REPLACE APPS",
          automationPercent: 91,
          accentColor: "#00E5FF",
          muted: false,
        }}
      />

      <Composition
        id="GeographySingaporeAnomaly"
        component={GeographySingaporeAnomaly}
        durationInFrames={GEO_SINGAPORE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={GeographySingaporeSchema}
        defaultProps={{
          headline: "HOW ONE TINY ISLAND OUT-EARNED EMPIRES",
          gdpPerCapita: 88400,
          accentColor: "#FF6B4A",
          muted: false,
        }}
      />

      <Folder name="LongForm">
        <Composition
          id="RichestCompaniesLongForm"
          component={RichestCompaniesLongForm}
          durationInFrames={LONG_FORM_DURATION}
          fps={30}
          width={1920}
          height={1080}
          schema={LongFormSchema}
          defaultProps={{
            title: "HOW 5 COMPANIES OUTGREW ENTIRE NATIONS",
            subtitle:
              "Inside the $15 trillion silicon and software monopoly reshaping global capital.",
            accentColor: "#D4AF37",
            muted: false,
          }}
        />
        <Composition
          id="WorkflowAutomationExplainer"
          component={WorkflowAutomationExplainer}
          durationInFrames={WORKFLOW_EXPLAINER_DURATION}
          fps={30}
          width={1920}
          height={1080}
          schema={WorkflowAutomationSchema}
          defaultProps={{
            accentColor: "#22D3EE",
            muted: false,
          }}
        />
      </Folder>

      <Folder name="Thumbnails">
        <Still
          id="LongFormThumbnail"
          component={ThumbnailComposition}
          width={1280}
          height={720}
          schema={ThumbnailSchema}
          defaultProps={{
            kicker: "BUSINESS DOCUMENTARY",
            headline: "5 COMPANIES RICHER THAN NATIONS",
            bigStat: "$15.2T",
            accentColor: "#D4AF37",
            bgColor: "#08090C",
          }}
        />
        <Still
          id="ShortsThumbnail"
          component={ThumbnailComposition}
          width={1080}
          height={1920}
          schema={ThumbnailSchema}
          defaultProps={{
            kicker: "SHORTS BRIEF",
            headline: "WHO CROSSES $5T FIRST?",
            bigStat: "$3.4T",
            accentColor: "#00E5FF",
            bgColor: "#040810",
          }}
        />
      </Folder>

      <Folder name="Templates">
        <Composition
          id="TemplatePlayground"
          component={TemplateCategoryDemo}
          durationInFrames={TEMPLATE_DEMO_DURATION}
          fps={30}
          width={1080}
          height={1920}
          schema={TemplateDemoSchema}
          defaultProps={{
            category: "financial-education",
            topic: "The Rule of 72 Compounding",
            headline: "HOW MONEY DOUBLES WHILE YOU SLEEP",
            statValue: 10.4,
            statSuffix: "x",
            muted: false,
          }}
        />
      </Folder>
    </>
  );
};
