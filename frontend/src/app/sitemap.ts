import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sreeharirealty.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic Project Routes
  try {
    const res = await api.getProjects();
    if (res.success && res.data) {
      const projectRoutes: MetadataRoute.Sitemap = res.data.map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
      return [...staticRoutes, ...projectRoutes];
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }

  return staticRoutes;
}
