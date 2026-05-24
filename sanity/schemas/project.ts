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
      name: "categories",
      title: "Categories",
      description: "Add one or more categories — each will appear as a filter on the site",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.required().min(1),
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
      description: "Optional — upload a video to replace the thumbnail image. Autoplays on loop.",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/ogg" },
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      description: "Short punchy line shown below the project title",
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
      description: "Each section has an optional caption and a bento grid layout. Layout adapts to the number of images.",
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
              name: "layout",
              title: "Layout",
              type: "string",
              initialValue: "two-col",
              options: {
                list: [
                  { value: "large-top-6", title: "Large Top (6 images)" },
                  { value: "large-bottom-6", title: "Large Bottom (6 images)" },
                  { value: "large-top-4", title: "Large Top (4 images)" },
                  { value: "large-bottom-4", title: "Large Bottom (4 images)" },
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
            select: { title: "caption", layout: "layout", media: "images.0" },
            prepare({ title, layout, media }: Record<string, any>) {
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
              return { title: title ?? labels[layout] ?? layout, media };
            },
          },
        },
      ],
    }),
    defineField({
      name: "mockupRows",
      title: "Product Mockups",
      description: "Each row can hold 1–3 images. Images render at their natural aspect ratio.",
      type: "array",
      of: [
        {
          type: "object",
          name: "mockupRow",
          title: "Row",
          fields: [
            defineField({
              name: "images",
              title: "Images (1–3 per row)",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (r) => r.max(3),
            }),
          ],
          preview: {
            select: { media: "images.0" },
            prepare({ media }: Record<string, any>) {
              return { title: "Mockup row", media };
            },
          },
        },
      ],
    }),
    // Legacy fields — hidden to preserve old data
    defineField({
      name: "mockups",
      title: "Mockups (legacy)",
      hidden: true,
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "contentSections",
      title: "Content Sections (legacy)",
      hidden: true,
      type: "array",
      of: [
        {
          type: "object",
          name: "contentSection",
          fields: [
            defineField({ name: "layout", title: "Layout", type: "string" }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
          ],
        },
      ],
    }),
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
    // Legacy single-category field
    defineField({
      name: "category",
      title: "Category (legacy)",
      type: "string",
      hidden: true,
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
