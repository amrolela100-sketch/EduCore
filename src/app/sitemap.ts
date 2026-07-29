import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://educore.ai";
  const today = "2026-07-26";

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: { "ar-SA": baseUrl, "en-US": `${baseUrl}/en` },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: { "ar-SA": baseUrl, "en-US": `${baseUrl}/en` },
      },
    },
    {
      url: `${baseUrl}/#jobs`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}