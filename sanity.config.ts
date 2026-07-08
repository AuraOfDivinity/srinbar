"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

const SINGLETONS = [
  ["siteSettings", "Site Settings"],
  ["homePage", "Home Page"],
  ["aboutPage", "About Page"],
  ["blogPage", "Blog Page"],
  ["eventsPage", "Events Page"],
  ["contactPage", "Contact Page"],
] as const;

const singletonTypes = new Set<string>(SINGLETONS.map(([t]) => t));

export default defineConfig({
  name: "srinbar",
  title: "SRINBAR",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...SINGLETONS.map(([type, title]) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(S.document().schemaType(type).documentId(type)),
            ),
            S.divider(),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("event").title("Events"),
            S.documentTypeListItem("teamMember").title("Team Members"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons can't be created or deleted from the "new document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
});
