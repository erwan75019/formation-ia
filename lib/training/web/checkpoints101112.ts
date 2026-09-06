import { readFileSync } from "node:fs";
import { join } from "node:path";

export type FinalCheckpoint = "lesson-10" | "lesson-11" | "lesson-12";

export function readCheckpointSource(checkpoint: FinalCheckpoint, relativePath: string) {
  if (relativePath.includes("..") || relativePath.startsWith("/")) {
    throw new Error("Chemin de checkpoint invalide");
  }
  return readFileSync(join(process.cwd(), "reference-apps/propertymatch-checkpoints", checkpoint, relativePath), "utf8");
}

export const lessonTenPropertyTypeCode = readCheckpointSource("lesson-10", "types/property.ts");
export const lessonTenPropertiesCode = readCheckpointSource("lesson-10", "data/properties.ts");
export const lessonTenPropertiesHelperCode = readCheckpointSource("lesson-10", "lib/properties.ts");
export const lessonTenNavigationCode = readCheckpointSource("lesson-10", "lib/property-navigation.ts");
export const lessonElevenFavoritesCode = readCheckpointSource("lesson-11", "lib/favorites.ts");
export const lessonTwelvePackageCode = readCheckpointSource("lesson-12", "package.json");
export const lessonTwelveCommands = ["npm run typecheck", "npm run lint", "npm test", "npm run build", "npx vercel", "npx vercel --prod"] as const;
