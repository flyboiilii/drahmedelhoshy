import { localizedString, type SanityType } from "./types";

/** Mirrors one entry of content/team.json */
export const teamMember: SanityType = {
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    localizedString("name", "Name"),
    localizedString("role", "Role"),
    { name: "image", title: "Portrait", type: "image", options: { hotspot: true } },
    { name: "placeholder", title: "Placeholder", type: "boolean", initialValue: false },
  ],
  preview: { select: { title: "name.en", media: "image" } },
};
