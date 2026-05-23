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
    <section className="px-[120px] pt-32 pb-24">
      <div className="grid grid-cols-[2fr_1fr] gap-16">
        <p className="font-satoshi text-base leading-relaxed text-text text-justify">
          Multidisciplinary creative working across brand identity, experience
          design, and creative technology. With a background spanning film,
          branding, and marketing strategy, I work across the full arc of a
          project; from identity systems to the interactive moment people
          remember.
        </p>

        <div className="flex flex-col gap-8 md:pt-1">
          <Credential
            degree="BFA Film & Television"
            school="Savannah College of Arts and Design"
          />
          <Credential
            degree="MSc Marketing & Creativity"
            school="ESCP Business School"
          />
        </div>
      </div>
    </section>
  );
}

function Credential({ degree, school }: { degree: string; school: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-satoshi text-base text-text">{degree}</span>
      <span className="font-satoshi text-xs tracking-widest uppercase text-text/60">
        {school}
      </span>
    </div>
  );
}
