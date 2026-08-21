import { defineField, defineType } from "sanity";
import { ColorInput } from "../components/ColorInput";

function colorField(name: string, title: string, initialValue: string, fieldset: string) {
  return {
    ...defineField({
      name,
      title,
      type: "string",
      initialValue,
      validation: (r: any) =>
        r.regex(/^#[0-9A-Fa-f]{6}$/, { name: "hex color" }).error("Must be a hex color, e.g. #1A1A18"),
      components: { input: ColorInput },
    }),
    fieldset,
  };
}

export default defineType({
  name: "siteSettings",
  title: "Site Colors",
  type: "document",
  fieldsets: [
    { name: "header", title: "Header" },
    { name: "hero", title: "Homepage Hero" },
    { name: "background", title: "Background" },
    { name: "grid", title: "Grid & Filters" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    {
      ...defineField({
        name: "headerLogo",
        title: "Header Logo",
        description:
          "Shown top-left of the header. Upload a plain black logo (transparent background) — it's shown white over the dark hero and switches to black once the header goes opaque.",
        type: "image",
      }),
      fieldset: "header",
    },
    colorField("headerBackground", "Header Background", "#F0F1ED", "header"),
    colorField("headerText", "Header Text", "#1A1A18", "header"),
    colorField("headerBorder", "Header Bottom Border", "#1A1A18", "header"),

    colorField("heroBackground", "Hero Background (top half)", "#2E1A47", "hero"),
    colorField("heroText", "Hero Text", "#F0F1ED", "hero"),

    colorField("backgroundColor", "Page Background (bottom half)", "#F0F1ED", "background"),

    colorField("gridOutline", "Grid Outline", "#1A1A18", "grid"),
    colorField("gridText", "Grid Text", "#1A1A18", "grid"),
    colorField("filteredBlockColor", "Filtered-Out Block Color", "#2E1A47", "grid"),
    colorField("filterOutline", "Filter Pill Outline", "#1A1A18", "grid"),
    colorField("filterText", "Filter Pill Text", "#1A1A18", "grid"),
    colorField("filterHoverBackground", "Filter Pill Hover Background", "#888888", "grid"),
    colorField("filterHoverText", "Filter Pill Hover Text", "#FFFFFF", "grid"),
    colorField("filterSelectedBackground", "Filter Pill Selected Background", "#1A1A18", "grid"),
    colorField("filterSelectedText", "Filter Pill Selected Text", "#F0F1ED", "grid"),

    colorField("footerBackground", "Footer Background", "#4A4945", "footer"),
    colorField("footerText", "Footer Text", "#FFFFFF", "footer"),
  ],
});
