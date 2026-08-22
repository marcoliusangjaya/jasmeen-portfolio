import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/client";
import { resumeQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";

export const revalidate = 60;

type EntryLink = { linkedProject?: { slug: string } | null; externalUrl?: string };

// Portable Text blocks — each block is one bullet/line; inline "link" marks
// can point at a project on the site or an external URL.
type RichText = any[];

type EducationEntry = EntryLink & {
  institution?: string;
  location?: string;
  dates?: string;
  degree?: string;
  honors?: RichText;
};

type ExperienceEntry = EntryLink & {
  organization?: string;
  location?: string;
  role?: string;
  dates?: string;
  bullets?: RichText;
};

type SkillCategory = { category: string; items?: string[] };

type ResumeData = {
  name?: string;
  email?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  resumeFile?: { url: string; originalFilename?: string };
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  involvements?: ExperienceEntry[];
  skillCategories?: SkillCategory[];
};

export default async function ResumePage() {
  const resume: ResumeData = (await client.fetch(resumeQuery)) ?? {};

  const hasContent =
    resume.name ||
    (resume.education?.length ?? 0) > 0 ||
    (resume.experience?.length ?? 0) > 0 ||
    (resume.involvements?.length ?? 0) > 0 ||
    (resume.skillCategories?.length ?? 0) > 0;

  return (
    <>
      <main className="px-[120px] pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          {hasContent ? (
            <>
              <Header resume={resume} />

              {resume.education && resume.education.length > 0 && (
                <Section title="Education">
                  <div className="flex flex-col gap-8">
                    {resume.education.map((e, i) => (
                      <EducationRow key={i} entry={e} />
                    ))}
                  </div>
                </Section>
              )}

              {resume.experience && resume.experience.length > 0 && (
                <Section title="Professional Experience">
                  <div className="flex flex-col gap-10">
                    {resume.experience.map((e, i) => (
                      <ExperienceRow key={i} entry={e} />
                    ))}
                  </div>
                </Section>
              )}

              {resume.involvements && resume.involvements.length > 0 && (
                <Section title="Involvements / Projects">
                  <div className="flex flex-col gap-10">
                    {resume.involvements.map((e, i) => (
                      <ExperienceRow key={i} entry={e} />
                    ))}
                  </div>
                </Section>
              )}

              {resume.skillCategories && resume.skillCategories.length > 0 && (
                <Section title="Skills & Qualifications">
                  <div className="flex flex-col gap-3">
                    {resume.skillCategories.map((sc, i) => (
                      <p key={i} className="font-satoshi text-sm leading-relaxed text-text/80">
                        <span className="font-medium text-text">{sc.category}: </span>
                        {(sc.items ?? []).join(", ")}
                      </p>
                    ))}
                  </div>
                </Section>
              )}

              {resume.resumeFile?.url && (
                <div className="flex justify-center mt-16">
                  <a
                    href={resume.resumeFile.url}
                    download={resume.resumeFile.originalFilename ?? "resume.pdf"}
                    className="font-satoshi text-xs tracking-widest uppercase px-6 py-3 rounded-full border-[1.5px] border-text text-text hover:bg-text hover:text-bg transition-colors duration-200"
                  >
                    Download Resume
                  </a>
                </div>
              )}
            </>
          ) : (
            <p className="font-satoshi text-sm text-text/60 text-center">
              Resume coming soon.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// Strips scheme/www/trailing-slash for a cleaner display label, e.g.
// "https://www.linkedin.com/in/jasmeen-shaqueita/" -> "linkedin.com/jasmeen-shaqueita"
function formatUrlLabel(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .replace(/^linkedin\.com\/in\//, "linkedin.com/");
}

function Header({ resume }: { resume: ResumeData }) {
  const contactParts: { label: string; href: string }[] = [];
  if (resume.email) contactParts.push({ label: resume.email, href: `mailto:${resume.email}` });
  if (resume.portfolioUrl)
    contactParts.push({ label: formatUrlLabel(resume.portfolioUrl), href: resume.portfolioUrl });
  if (resume.linkedinUrl)
    contactParts.push({ label: formatUrlLabel(resume.linkedinUrl), href: resume.linkedinUrl });

  return (
    <div className="mb-16 text-center">
      {resume.name && (
        <h1 className="font-cabinet text-3xl md:text-4xl font-medium mb-3">{resume.name}</h1>
      )}
      {contactParts.length > 0 && (
        <p className="font-satoshi text-sm text-text/60">
          {contactParts.map((c, i) => (
            <span key={c.href}>
              {i > 0 && " | "}
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
                {c.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-cabinet text-xl font-medium tracking-wide uppercase pb-2 mb-6 border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Org/institution heading — bold + underlined whenever it's actually a link
// (project ref or external URL) so it's unmistakable, plain otherwise.
function EntryHeading({ entry, label }: { entry: EntryLink; label?: string }) {
  const isLinked = !!(entry.linkedProject?.slug || entry.externalUrl);
  const textClass = `font-cabinet text-lg ${
    isLinked ? "font-bold underline decoration-2 underline-offset-4" : "font-medium"
  }`;

  if (entry.linkedProject?.slug) {
    return (
      <Link href={`/projects/${entry.linkedProject.slug}`} className="hover:text-text/60 transition-colors">
        <span className={textClass}>{label}</span>
      </Link>
    );
  }
  if (entry.externalUrl) {
    return (
      <a
        href={entry.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-text/60 transition-colors"
      >
        <span className={textClass}>{label}</span>
      </a>
    );
  }
  return <span className={textClass}>{label}</span>;
}

// Renders an inline "link" mark from Portable Text (project ref takes
// priority over an external URL) as an underlined link within running text.
function InlineLinkMark({ value, children }: { value?: EntryLink; children: React.ReactNode }) {
  const linkClass = "font-semibold underline decoration-1 underline-offset-2 hover:text-text/60 transition-colors";
  if (value?.linkedProject?.slug) {
    return (
      <Link href={`/projects/${value.linkedProject.slug}`} className={linkClass}>
        {children}
      </Link>
    );
  }
  if (value?.externalUrl) {
    return (
      <a href={value.externalUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

// For "honors" — a single inline line, not a bulleted list.
const inlineTextComponents: PortableTextComponents = {
  block: { normal: ({ children }) => <>{children}</> },
  marks: { link: InlineLinkMark },
};

// For "bullets" — each Portable Text block becomes one <li>.
const bulletTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <li className="font-satoshi text-sm leading-relaxed text-text/80">{children}</li>
    ),
  },
  marks: { link: InlineLinkMark },
};

function EducationRow({ entry }: { entry: EducationEntry }) {
  const hasHonors = entry.honors && entry.honors.length > 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <EntryHeading entry={entry} label={entry.institution} />
        {entry.dates && (
          <span className="font-satoshi text-sm text-text/40 shrink-0">{entry.dates}</span>
        )}
      </div>
      {entry.location && (
        <p className="font-satoshi text-sm text-text/50">{entry.location}</p>
      )}
      {(entry.degree || hasHonors) && (
        <p className="font-satoshi text-sm text-text/80 mt-1">
          {entry.degree}
          {entry.degree && hasHonors && " | "}
          {hasHonors && <PortableText value={entry.honors} components={inlineTextComponents} />}
        </p>
      )}
    </div>
  );
}

function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <EntryHeading entry={entry} label={entry.organization} />
        {entry.location && (
          <span className="font-satoshi text-sm text-text/40 shrink-0">{entry.location}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        {entry.role && (
          <span className="font-satoshi text-sm italic text-text/70">{entry.role}</span>
        )}
        {entry.dates && (
          <span className="font-satoshi text-sm text-text/40 shrink-0">{entry.dates}</span>
        )}
      </div>
      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="list-disc list-outside pl-5 space-y-1.5">
          <PortableText value={entry.bullets} components={bulletTextComponents} />
        </ul>
      )}
    </div>
  );
}
