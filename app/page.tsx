import { client } from "@/sanity/client";
import { projectsQuery } from "@/sanity/queries";
import ProjectGrid, { type Project } from "@/components/ProjectGrid";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function Home() {
  const projects: Project[] = await client.fetch(projectsQuery);

  return (
    <>
      <main>
        <Hero />
        <ProjectGrid projects={projects} />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-[120px] text-center bg-accent">
      <h1 className="font-cabinet text-6xl md:text-8xl font-medium tracking-widest uppercase text-accent-text">
        Jasmeen Shaqueita
      </h1>
      <p className="font-satoshi text-base md:text-lg text-white/70 max-w-xl">
        Multidisciplinary creative working across brand identity, experience
        design, and creative technology.
      </p>
    </section>
  );
}
