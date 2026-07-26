import {
  AircraftGameIcon,
  BbqGrillIcon,
  Bone01Icon,
  ClaudeIcon,
  CssThreeIcon,
  HtmlFiveIcon,
  IceHockeyIcon,
  JavaScriptIcon,
  Location03Icon,
  MachineRobotIcon,
  Mail01Icon,
  MusicNote01Icon,
  SnowIcon,
  SqlIcon,
  TailwindcssIcon,
  TelephoneIcon,
  TriangleRightIcon,
  Typescript01Icon,
  Vynil02Icon,
  WebDesign01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import {
  gitMerge,
  infiniteSharp,
  logoAmazon,
  logoAndroid,
  logoApple,
  logoBitbucket,
  logoCapacitor,
  logoDocker,
  logoFigma,
  logoGithub,
  logoIonic,
  logoLinkedin,
  logoNodejs,
  logoReact,
  logoSass,
  logoVercel,
} from "ionicons/icons";
import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { AppIcon } from "@/components/ui/icon";

type LinkItem = {
  icon: IconSvgElement | string;
  label: string;
  href: string;
};

type SkillGroup = {
  label: string;
  items: Array<{ label: string; icon?: IconSvgElement | string }>;
};

type CvEntry = {
  title: string;
  role?: string;
  location: string;
  dateRanges: Array<string>;
  bullets: Array<string>;
};

type Hobby = {
  icon: IconSvgElement;
  label: string;
};

const contactLinks: Array<LinkItem> = [
  {
    icon: Mail01Icon,
    label: "michael.w.brucker@gmail.com",
    href: "mailto:michael.w.brucker@gmail.com",
  },
  { icon: TelephoneIcon, label: "+43 677 638 00 748", href: "tel:+4367763800748" },
  {
    icon: Location03Icon,
    label: "Innsbruck, Austria",
    href: "https://www.google.com/maps?q=Innsbruck,+Austria",
  },
];

const socialLinks: Array<LinkItem> = [
  { icon: WebDesign01Icon, label: "mikebrucker.com", href: "https://mikebrucker.com" },
  {
    icon: logoLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mike-brucker",
  },
  {
    icon: logoGithub,
    label: "GitHub",
    href: "https://github.com/mikebrucker",
  },
];

const skills: Array<SkillGroup> = [
  {
    label: "Languages",
    items: [
      { label: "TypeScript", icon: Typescript01Icon },
      { label: "JavaScript", icon: JavaScriptIcon },
      { label: "HTML", icon: HtmlFiveIcon },
      { label: "CSS", icon: CssThreeIcon },
      { label: "Sass", icon: logoSass },
    ],
  },
  {
    label: "Frontend",
    items: [
      { label: "React", icon: logoReact },
      { label: "Next.js", icon: logoVercel },
      { label: "Tailwind CSS", icon: TailwindcssIcon },
      { label: "MobX" },
      { label: "Zustand" },
    ],
  },
  {
    label: "Backend",
    items: [{ label: "Node.js", icon: logoNodejs }, { label: "Express" }, { label: "NestJS" }],
  },
  { label: "Testing", items: [{ label: "Cypress" }, { label: "Jest" }] },
  {
    label: "Data",
    items: [
      { label: "MySQL", icon: SqlIcon },
      { label: "PostgreSQL", icon: SqlIcon },
      { label: "Amazon Aurora", icon: logoAmazon },
      { label: "Elasticsearch" },
    ],
  },
  {
    label: "DevOps",
    items: [
      { label: "Git", icon: gitMerge },
      { label: "Docker", icon: logoDocker },
      { label: "AWS", icon: logoAmazon },
      { label: "CI/CD Pipelines", icon: infiniteSharp },
      { label: "Bamboo" },
      { label: "Bitbucket", icon: logoBitbucket },
      { label: "Github", icon: logoGithub },
    ],
  },
  {
    label: "Tooling",
    items: [
      { label: "Claude AI", icon: ClaudeIcon },
      { label: "Vite" },
      { label: "ESLint" },
      { label: "Prettier" },
      { label: "Biome" },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { label: "Figma", icon: logoFigma },
      { label: "Atlassian Suite" },
      { label: "Jira" },
      { label: "Confluence" },
    ],
  },
  {
    label: "Mobile",
    items: [
      { label: "Ionic", icon: logoIonic },
      { label: "Capacitor", icon: logoCapacitor },
      { label: "Android", icon: logoAndroid },
      { label: "iOS", icon: logoApple },
    ],
  },
];

const experience: Array<CvEntry> = [
  {
    title: "Swarovski",
    role: "Full-stack Developer",
    location: "Wattens, Austria",
    dateRanges: ["Feb 2020 - Apr 2023", "Nov 2023 - Present"],
    bullets: [
      "Implemented TypeScript based React frontends with complex MobX state management and Node.js APIs for various applications including product catalogs, communications tools, and retail omnichannel mobile apps (iOS, PWA, Android).",
      "Leveraged AWS Lambda, Elasticsearch, DynamoDB etc. within a wide range of applications and microservices as well as employed various DevOps techniques to automate building and deployment routines.",
      "Maintained and refactored legacy code, reducing technical debt and improving maintainability.",
      "Translated Figma designs into consistent UI components, ensuring adherence to brand styling.",
      "Collaborated with QA to test features and resolve bugs.",
      "Designed and contributed to new microservice architectures, enhancing customer experience and boosting team productivity.",
    ],
  },
  {
    title: "FERCHAU",
    role: "Full-stack Developer",
    location: "Innsbruck, Austria",
    dateRanges: ["May 2023 - Oct 2023"],
    bullets: [
      "Developed and enhanced a NestJS microservice application, while refactoring legacy code to reduce technical debt.",
      "Leveraged Microsoft Azure DevOps to manage CI/CD pipelines, ensuring fast and reliable deployments.",
      "Implemented features and bug fixes for Full-stack projects using TypeScript React SPA/PWA and Node.js/Java APIs.",
    ],
  },
  {
    title: "OneMagnify",
    role: "Frontend Developer",
    location: "Wilmington, Delaware",
    dateRanges: ["Oct 2019 - Feb 2020"],
    bullets: [
      "Developed responsive HTML marketing emails with cross-client compatibility (Gmail, Outlook, Apple Mail, etc).",
      "Translated designer layouts into production-ready email templates while maintaining pixel-accurate styling.",
      "Built static marketing sites and internal React tools to streamline HTML email generation.",
    ],
  },
];

const education: Array<CvEntry> = [
  {
    title: "New York Code + Design Academy",
    location: "Philadelphia, Pennsylvania",
    dateRanges: ["Jul 2018 - Oct 2018"],
    bullets: [
      "Completed 480+ hours of Web Development Intensive Program covering various Full-Stack technologies and various methodologies including OOP, TDD, pair-programming, AGILE, and SCRUM.",
    ],
  },
  {
    title: "Temple University",
    location: "Philadelphia, Pennsylvania",
    dateRanges: ["Sep 2011 - Dec 2015"],
    bullets: [
      "Bachelor of Arts - Media Studies and Production.",
      "Audio track focus, also took related courses in graphics design, web development, audio and video editing.",
      "Inline Hockey 2013 - 2015.",
    ],
  },
];

const otherExperience: Array<CvEntry> = [
  {
    title: "1&1 Internet",
    role: "MyWebsite Technical Support",
    location: "Chesterbrook, Pennsylvania",
    dateRanges: ["Jan 2016 - Sep 2016"],
    bullets: [
      "Assisted customers on creating/editing websites, e-commerce sites, domains, and e-mail.",
    ],
  },
  {
    title: "United States Air Force",
    role: "Aircraft Armament Systems Technician",
    location: "North Las Vegas, Nevada",
    dateRanges: ["Sep 2007 - Sep 2010"],
    bullets: [
      'Worked in teams of 3 called load crews as a "2-man" responsible for technical preparation and attachment of live and dummy munitions for the advanced airframe F-15E.',
      "Entrusted with E-4/E-5 level hardware troubleshooting and testing.",
      "Achieved Journeyman Level early at the rank of E-3.",
      "BTZ (Below-The-Zone) Nominee for early promotion due to outstanding work.",
      "Awarded Load Crew of the Year in 2008 on one of the largest Air Force bases with 7 different Aircraft Maintenance Units and 50+ other load crews.",
      "Distinguished Graduate of Technical School with an overall grade of 99/100.",
    ],
  },
];

const hobbies: Array<Hobby> = [
  { icon: IceHockeyIcon, label: "Hockey (Goalie)" },
  { icon: BbqGrillIcon, label: "Cooking" },
  { icon: MachineRobotIcon, label: "Home Tech Projects" },
  { icon: Bone01Icon, label: "Dog" },
  { icon: MusicNote01Icon, label: "Guitar" },
  { icon: Vynil02Icon, label: "Music" },
  { icon: SnowIcon, label: "Snowboarding" },
  { icon: TriangleRightIcon, label: "Skateboarding" },
  { icon: AircraftGameIcon, label: "Console Gaming & Modding" },
];

function EntryCard({ title, role, location, dateRanges, bullets }: CvEntry) {
  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
        <div>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          {role ? <h4 className="text-muted-foreground font-medium">{role}</h4> : null}
          <small className="text-muted-foreground">{location}</small>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right shrink-0">
          {dateRanges.map((range) => (
            <div key={range}>{range}</div>
          ))}
        </div>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CvPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-1">
        <Image
          src="/headshot.jpg"
          alt="Mike Brucker headshot"
          width={144}
          height={144}
          className="rounded-full size-36 object-cover shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Mike Brucker</h1>
          <p className="text-muted-foreground">Senior Software Developer, TypeScript & React</p>
          <div className="flex flex-col gap-0.5 mt-3">
            <div className="flex flex-wrap gap-0.5">
              {contactLinks.map((item) => (
                <Button key={item.href} asChild variant="keyboard" size="sm" className="flex-auto">
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <AppIcon icon={item.icon} className="size-5" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-0.5">
              {socialLinks.map((item) => (
                <Button key={item.href} asChild variant="keyboard" size="sm" className="flex-auto">
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <AppIcon icon={item.icon} className="size-5" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Accordion
        size="xl"
        title="Skills"
        classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 pb-2">
          {skills.map((group) => (
            <div key={group.label}>
              <p className="font-semibold">{group.label}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {group.items.map((item) => (
                  <Chip key={item.label} text={item.label} icon={item.icon} useIconThemeColor />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion
        size="xl"
        title="Work Experience"
        classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      >
        <div className="flex flex-col gap-3">
          {experience.map((entry) => (
            <EntryCard key={entry.title} {...entry} />
          ))}
        </div>
      </Accordion>

      <Accordion
        size="xl"
        title="Education"
        classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      >
        <div className="flex flex-col gap-3">
          {education.map((entry) => (
            <EntryCard key={entry.title} {...entry} />
          ))}
        </div>
      </Accordion>

      <Accordion
        size="xl"
        title="Other Experience"
        classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      >
        <div className="flex flex-col gap-3">
          {otherExperience.map((entry) => (
            <EntryCard key={entry.title} {...entry} />
          ))}
        </div>
      </Accordion>

      <Accordion
        size="xl"
        title="Hobbies"
        classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      >
        <div className="flex flex-wrap gap-1.5 pb-2">
          {hobbies.map((hobby) => (
            <Chip key={hobby.label} text={hobby.label} icon={hobby.icon} useIconThemeColor />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
