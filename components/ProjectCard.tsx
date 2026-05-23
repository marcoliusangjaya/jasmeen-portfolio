import Image from "next/image";
import { urlFor } from "@/lib/sanity-image";

type Project = {
  _id: string;
  title: string;
  description?: string;
  coverImage?: { asset: { _ref: string } };
  tags?: string[];
  projectUrl?: string;
  githubUrl?: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {project.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={urlFor(project.coverImage).width(600).height(400).url()}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        {project.description && (
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
        )}
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 text-sm">
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Live →
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
