import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "polaroidPhoto",
      title: "Polaroid Photo",
      description: "Shown on the About page with a white border + slight tilt",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "credentials",
      title: "Education Credentials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "degree", title: "Degree", type: "string" }),
            defineField({ name: "school", title: "School", type: "string" }),
            defineField({
              name: "year",
              title: "Year",
              type: "string",
              placeholder: "e.g. 2022 or 2018–2022",
            }),
          ],
          preview: {
            select: { title: "degree", subtitle: "school", year: "year" },
            prepare({ title, subtitle, year }: Record<string, any>) {
              return { title, subtitle: year ? `${subtitle} · ${year}` : subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "skills",
      title: "Skills / Filter Pills",
      description: "Shown as clickable pills on the About page",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "resumeFile",
      title: "Resume (PDF)",
      description: "Upload your resume — shown on the Resume page with a view/expand and download option",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description: "Shown in the footer and on the Contact page (e.g. Instagram, Kuno + Kini)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
});
