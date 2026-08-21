import { defineField, defineType } from "sanity";

// Shared by Education / Experience / Involvements entries — link an entry to
// an existing project on the site, or fall back to any external URL.
function linkFields() {
  return [
    defineField({
      name: "linkedProject",
      title: "Link to Project",
      description: "Pick an existing project on this site (optional)",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "externalUrl",
      title: "Or External URL",
      description: "Use instead of (or in addition to) a linked project",
      type: "url",
    }),
  ];
}

// Rich-text field that supports selecting a phrase and turning it into a
// link (to a project on the site, or any external URL) — used for prose
// fields (honors, bullet points) where only part of the sentence links out,
// not the whole line. `blockName` must be unique per field in the schema.
function richTextField(name: string, title: string, blockName: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: "array",
    of: [
      {
        type: "block",
        name: blockName,
        styles: [],
        lists: [],
        marks: {
          decorators: [],
          annotations: [
            {
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                defineField({
                  name: "linkedProject",
                  title: "Link to Project",
                  type: "reference",
                  to: [{ type: "project" }],
                }),
                defineField({
                  name: "externalUrl",
                  title: "Or External URL",
                  type: "url",
                }),
              ],
            },
          ],
        },
      },
    ],
  });
}

export default defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  groups: [
    { name: "header", title: "Header" },
    { name: "education", title: "Education" },
    { name: "experience", title: "Experience" },
    { name: "involvements", title: "Involvements" },
    { name: "skills", title: "Skills" },
    { name: "file", title: "PDF" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "header" }),
    defineField({ name: "email", title: "Email", type: "string", group: "header" }),
    defineField({ name: "portfolioUrl", title: "Portfolio URL", type: "url", group: "header" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url", group: "header" }),

    defineField({
      name: "education",
      title: "Education",
      type: "array",
      group: "education",
      of: [
        {
          type: "object",
          name: "educationEntry",
          fields: [
            defineField({ name: "institution", title: "Institution", type: "string" }),
            defineField({ name: "location", title: "Location", type: "string" }),
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              placeholder: "e.g. Expected 2027, Graduated July 2023",
            }),
            defineField({ name: "degree", title: "Degree", type: "string" }),
            richTextField(
              "honors",
              "Honors / Achievements",
              "educationHonorsBlock",
              "e.g. Dean's List, Academic & Artistic Scholarship Recipient — select text to link part of it"
            ),
            ...linkFields(),
          ],
          preview: {
            select: { title: "institution", subtitle: "degree" },
          },
        },
      ],
    }),

    defineField({
      name: "experience",
      title: "Professional Experience",
      type: "array",
      group: "experience",
      of: [
        {
          type: "object",
          name: "experienceEntry",
          fields: [
            defineField({ name: "organization", title: "Organization", type: "string" }),
            defineField({ name: "location", title: "Location", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              placeholder: "e.g. July 2026 – Present",
            }),
            richTextField(
              "bullets",
              "Bullet Points",
              "experienceBulletBlock",
              "Each paragraph becomes one bullet — select text within it to link part of it"
            ),
            ...linkFields(),
          ],
          preview: {
            select: { title: "organization", subtitle: "role" },
          },
        },
      ],
    }),

    defineField({
      name: "involvements",
      title: "Involvements / Projects",
      type: "array",
      group: "involvements",
      of: [
        {
          type: "object",
          name: "involvementEntry",
          fields: [
            defineField({ name: "organization", title: "Organization / Project", type: "string" }),
            defineField({ name: "location", title: "Location", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              placeholder: "e.g. June 2026 – July 2026",
            }),
            richTextField(
              "bullets",
              "Bullet Points",
              "involvementBulletBlock",
              "Each paragraph becomes one bullet — select text within it to link part of it"
            ),
            ...linkFields(),
          ],
          preview: {
            select: { title: "organization", subtitle: "role" },
          },
        },
      ],
    }),

    defineField({
      name: "skillCategories",
      title: "Skills & Qualifications",
      type: "array",
      group: "skills",
      of: [
        {
          type: "object",
          name: "skillCategory",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              placeholder: "e.g. Marketing & Strategy, Languages",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
          ],
          preview: {
            select: { title: "category", subtitle: "items" },
            prepare({ title, subtitle }: Record<string, any>) {
              return { title, subtitle: Array.isArray(subtitle) ? subtitle.join(", ") : subtitle };
            },
          },
        },
      ],
    }),

    defineField({
      name: "resumeFile",
      title: "Resume (PDF)",
      description: "Downloadable version — shown as a Download button on the Resume page",
      type: "file",
      options: { accept: "application/pdf" },
      group: "file",
    }),
  ],
});
