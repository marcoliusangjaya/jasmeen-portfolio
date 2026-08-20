import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import {
  HeroLayoutPicker,
  ContentLayoutPicker,
} from "../components/LayoutPicker";
import { HeroPreviewInput } from "../components/HeroPreviewInput";
import { CategoryInput } from "../components/CategoryInput";

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
      description: "Click existing categories to add, or type new ones below",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.required().min(1),
      components: { input: CategoryInput },
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
      name: "tools",
      title: "Tools",
      description: "Tools used on this project, shown below location/date",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "thumbnailImage",
      title: "Thumbnail Image",
      description: "Shown on the project grid card",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "thumbnailSize",
      title: "Thumbnail Size",
      description: "How large the image appears within the card",
      type: "string",
      initialValue: "medium",
      options: {
        list: [
          { value: "small", title: "Small (33%)" },
          { value: "medium", title: "Medium (50%)" },
          { value: "large", title: "Large (70%)" },
          { value: "full", title: "Full (90%)" },
        ],
        layout: "radio",
      },
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "relatedLinks",
      title: "Related Links",
      description: "Shown as pills between the description and the content sections — link out to Instagram, GitHub, a live site, etc.",
      type: "array",
      of: [
        {
          type: "object",
          name: "relatedLink",
          title: "Link",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              placeholder: "e.g. Instagram, GitHub, Live Site",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
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
      name: "sections",
      title: "Content Sections",
      description: "Each section is a bento grid. Choose a layout, then add images — each image can have a label shown inside its cell.",
      type: "array",
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              initialValue: "three-large-top",
              options: {
                list: [
                  { value: "single", title: "Full Width (1 image)" },
                  { value: "two-stacked", title: "Two Stacked (2 images)" },
                  { value: "two-side-by-side", title: "Side by Side (2 images)" },
                  { value: "three-large-top", title: "1 Top, 2 Bottom (3 images)" },
                  { value: "three-large-bottom", title: "2 Top, 1 Bottom (3 images)" },
                  { value: "three-side-by-side", title: "Side by Side (3 images)" },
                  { value: "three-stacked", title: "Three Stacked (3 images)" },
                  { value: "four-grid-2x2", title: "2 Top, 2 Bottom (4 images)" },
                  { value: "four-top3-bottom1", title: "3 Top, 1 Bottom (4 images)" },
                  { value: "four-top1-bottom3", title: "1 Top, 3 Bottom (4 images)" },
                  { value: "five-grid", title: "2 Top, 3 Bottom (5 images)" },
                  { value: "five-top3-bottom2", title: "3 Top, 2 Bottom (5 images)" },
                  { value: "large-top-6", title: "Large Top (6 images)" },
                  { value: "large-bottom-6", title: "Large Bottom (6 images)" },
                ],
              },
              validation: (r) => r.required(),
              components: { input: ContentLayoutPicker },
            }),
            defineField({
              name: "items",
              title: "Images",
              description: "Add images in order. Each image can have a label displayed inside its cell.",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "bentoItem",
                  title: "Image",
                  fields: [
                    defineField({
                      name: "image",
                      title: "Image",
                      type: "image",
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      placeholder: "e.g. Packaging Design, Cup Design…",
                    }),
                  ],
                  preview: {
                    select: { title: "label", media: "image" },
                    prepare({ title, media }: Record<string, any>) {
                      return { title: title ?? "Unlabelled", media };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { layout: "layout", media: "items.0.image" },
            prepare({ layout, media }: Record<string, any>) {
              const labels: Record<string, string> = {
                single: "Full Width",
                "two-stacked": "Two Stacked",
                "two-side-by-side": "Side by Side (2)",
                "three-large-top": "1 Top, 2 Bottom",
                "three-large-bottom": "2 Top, 1 Bottom",
                "three-side-by-side": "Side by Side (3)",
                "three-stacked": "Three Stacked",
                "four-grid-2x2": "2 Top, 2 Bottom",
                "four-top3-bottom1": "3 Top, 1 Bottom",
                "four-top1-bottom3": "1 Top, 3 Bottom",
                "five-grid": "2 Top, 3 Bottom",
                "five-top3-bottom2": "3 Top, 2 Bottom",
                "large-top-6": "Large Top (6)",
                "large-bottom-6": "Large Bottom (6)",
              };
              return { title: labels[layout] ?? layout, media };
            },
          },
        },
      ],
    }),
    defineField({
      name: "mockupRows",
      title: "Product Mockups",
      description: "Each row can hold 1–3 items (images or videos). Items render at their natural aspect ratio.",
      type: "array",
      of: [
        {
          type: "object",
          name: "mockupRow",
          title: "Row",
          fields: [
            defineField({
              name: "items",
              title: "Items (1–3 per row)",
              description: "Add images or videos. Mix freely.",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "mockupItem",
                  title: "Item",
                  fields: [
                    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
                    defineField({
                      name: "video",
                      title: "Video",
                      description: "Upload a video instead of an image (mp4/webm).",
                      type: "file",
                      options: { accept: "video/mp4,video/webm,video/ogg" },
                    }),
                  ],
                  preview: {
                    select: { media: "image" },
                    prepare({ media }: Record<string, any>) {
                      return { title: "Mockup item", media };
                    },
                  },
                },
              ],
              validation: (r) => r.max(3),
            }),
          ],
          preview: {
            select: { media: "items.0.image" },
            prepare({ media }: Record<string, any>) {
              return { title: "Mockup row", media };
            },
          },
        },
      ],
    }),
    // Legacy fields — hidden to preserve old data
    defineField({ name: "sectionLabel", title: "Section Label (legacy)", type: "string", hidden: true }),
    defineField({ name: "sectionDescription", title: "Section Description (legacy)", type: "text", hidden: true }),
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
