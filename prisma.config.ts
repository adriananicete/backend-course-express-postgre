import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    adapter: async () => {
      const { PrismaNeonHttp } = await import("@prisma/adapter-neon");
      return new PrismaNeonHttp(process.env.DATABASE_URL!);
    },
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});