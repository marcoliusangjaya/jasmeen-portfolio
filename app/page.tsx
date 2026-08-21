import { client } from "@/sanity/client";
import { projectsQuery, heroTaglineQuery } from "@/sanity/queries";
import ProjectGrid, { type Project } from "@/components/ProjectGrid";
import Footer from "@/components/Footer";

export const revalidate = 60;

const DEFAULT_TAGLINE =
  "Multidisciplinary creative working across brand identity, experience design, and creative technology.";

export default async function Home() {
  const [projects, heroData]: [Project[], { heroTagline?: string } | null] =
    await Promise.all([
      client.fetch(projectsQuery),
      client.fetch(heroTaglineQuery),
    ]);

  return (
    <>
      <main>
        <Hero tagline={heroData?.heroTagline || DEFAULT_TAGLINE} />
        <ProjectGrid projects={projects} />
      </main>
      <Footer />
    </>
  );
}

function Hero({ tagline }: { tagline: string }) {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-[120px] text-center bg-accent">
      <h1 className="font-cabinet text-6xl md:text-8xl font-medium tracking-wide text-accent-text">
        Jasmeen Shaqueita
      </h1>
      <p className="font-satoshi text-base md:text-lg text-accent-text/70 max-w-xl mt-10">
        {tagline}
      </p>
    </section>
  );
}
