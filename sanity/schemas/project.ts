import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import {
  HeroLayoutPicker,
  ContentLayoutPicker,
} from "../components/LayoutPicker";
import { HeroPreviewInput } from "../components/HeroPreviewInput";
import { ContentSectionInput } from "../components/ContentSectionInput";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    orderRankField({ type: "project" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description:
        "Type any category — it will automatically appear as a filter on the site",
      type: "string",
      placeholder: "e.g. Branding, Events/Experiential, Creative Technology…",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      placeholder: "e.g. San Francisco, CA",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      placeholder: "e.g. March 2026",
    }),
    defineField({
      name: "thumbnailImage",
      title: "Thumbnail Image",
      description: "Shown on the project grid card",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverVideo",
      title: "Thumbnail Video",
      description: "Optional — upload a video or GIF to replace the thumbnail image. Autoplays on loop.",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/ogg" },
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      description: "Short punchy line shown below the project title (e.g. 'How to build brand character')",
      type: "string",
    }),
    defineField({
      name: "heroLayout",
      title: "Hero Layout",
      description: "How the hero images are arranged at the top of the project page",
      type: "string",
      initialValue: "classic",
      options: {
        list: [
          { value: "classic", title: "Showcase" },
          { value: "four-grid", title: "Even Grid" },
          { value: "large-right", title: "Right Focus" },
          { value: "large-left-two-right", title: "Left Focus" },
          { value: "two-col", title: "Side by Side" },
          { value: "single", title: "Full Width" },
        ],
      },
      components: { input: HeroLayoutPicker },
    }),
    defineField({
      name: "heroImages",
      title: "Hero Images",
      description: "Mood board at the top of the project page. Drag to reorder.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.max(4),
      components: { input: HeroPreviewInput },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "sections",
      title: "Content Sections",
      description: "Add as many sections as you like. Each section has an optional caption and images — layout adapts automatically to the number of images.",
      type: "array",
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "caption",
              title: "Caption / Section Title",
              type: "string",
              placeholder: "e.g. Logo Development, Color System, Cup Design…",
            }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
          ],
          preview: {
            select: { title: "caption", media: "images.0" },
            prepare({ title, media }: Record<string, any>) {
              return { title: title ?? "Untitled section", media };
            },
          },
        },
      ],
    }),
    defineField({
      name: "mockups",
      title: "Product Mockups",
      description: "Full-width images shown after the content sections — great for branding projects",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    // Legacy — hidden to preserve old data
    defineField({
      name: "contentSections",
      title: "Content Sections (legacy)",
      hidden: true,
      type: "array",
      of: [
        {
          type: "object",
          name: "contentSection",
          title: "Content Section",
          fields: [
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              initialValue: "two-col",
              options: {
                list: [
                  { value: "large-top-6", title: "Large Top (6)" },
                  { value: "large-bottom-6", title: "Large Bottom (6)" },
                  { value: "large-top-4", title: "Large Top (4)" },
                  { value: "large-bottom-4", title: "Large Bottom (4)" },
                  { value: "five-grid", title: "5 Grid" },
                  { value: "three-col", title: "Three Column" },
                  { value: "two-col", title: "Two Column" },
                  { value: "single", title: "Full Width" },
                ],
              },
              validation: (r) => r.required(),
              components: { input: ContentLayoutPicker },
            }),
            defineField({
              name: "images",
              title: "Images",
              description:
                "large-top-6 / large-bottom-6: 6 · large-top-4 / large-bottom-4: 4 · five-grid: 5 · three-col: 3 · two-col: 2 · single: 1",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
          ],
          components: { input: ContentSectionInput },
          preview: {
            select: { layout: "layout", media: "images.0" },
            prepare({ layout, media }: Record<string, any>) {
              const labels: Record<string, string> = {
                "large-top-6": "Large Top (6)",
                "large-bottom-6": "Large Bottom (6)",
                "large-top-4": "Large Top (4)",
                "large-bottom-4": "Large Bottom (4)",
                "five-grid": "5 Grid",
                "three-col": "Three Column",
                "two-col": "Two Column",
                single: "Full Width",
              };
              return { title: labels[layout] ?? layout, media };
            },
          },
        },
      ],
    }),
    // Legacy field — hidden, keeps existing data from causing Studio warnings
    defineField({
      name: "contentBlocks",
      title: "Content Blocks (legacy)",
      type: "array",
      hidden: true,
      of: [
        {
          type: "object",
          name: "contentBlock",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "fullWidth", title: "Full Width", type: "boolean", initialValue: false }),
          ],
        },
      ],
    }),
    defineField({
      name: "sectionLabel",
      title: "Section Label",
      type: "string",
      placeholder: "e.g. Dieline Support",
    }),
    defineField({
      name: "sectionDescription",
      title: "Section Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "otherWork",
      title: "Other Work",
      description: "Pick up to 2 related projects to show at the bottom",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (r) => r.max(2),
    }),
  ],
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
