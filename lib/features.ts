// Temporarily pause the public blog. Set to true when it is ready to launch.
// Keep the routes, components and Sanity content intact for that launch.
export const BLOG_ENABLED: boolean = false;

export function isBlogLink(href: string, label = "") {
  if (/\bblog\b/i.test(label)) return true;
  try {
    return /^\/(blog|article)(\/|$)/i.test(new URL(href, "https://srinbar.invalid").pathname);
  } catch {
    return false;
  }
}
