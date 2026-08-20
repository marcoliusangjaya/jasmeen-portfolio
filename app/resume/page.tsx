import { client } from "@/sanity/client";
import { resumeQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";
import ResumeViewer from "@/components/ResumeViewer";

export const revalidate = 60;

type ResumeData = {
  resumeFile?: { url: string; originalFilename?: string };
};

export default async function ResumePage() {
  const data: ResumeData = (await client.fetch(resumeQuery)) ?? {};
  const file = data.resumeFile;

  return (
    <>
      <main className="px-[120px] pt-32 pb-24 flex flex-col items-center text-center">
        <h1 className="font-cabinet text-3xl md:text-4xl font-medium mb-12">
          Resume
        </h1>

        {file?.url ? (
          <ResumeViewer url={file.url} filename={file.originalFilename} />
        ) : (
          <p className="font-satoshi text-sm text-text/60">
            Resume coming soon.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
