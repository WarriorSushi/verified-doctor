import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://verified.doctor";
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic doctor profile pages
  const { data: profiles } = await supabase
    .from("profiles")
    .select("handle, updated_at, is_verified")
    .eq("is_frozen", false)
    .order("updated_at", { ascending: false });

  const profilePages: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
    url: `${baseUrl}/${profile.handle}`,
    lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    // Verified doctors get higher priority
    priority: profile.is_verified ? 0.9 : 0.8,
  }));

  return [...staticPages, ...profilePages];
}
