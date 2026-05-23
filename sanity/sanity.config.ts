import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./schemas";
import { apiVersion, dataset, projectId } from "./env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            orderableDocumentListDeskItem({ type: "project", S, context }),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "project"
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
