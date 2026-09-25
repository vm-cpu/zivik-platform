/// <reference types="astro/client" />

declare module "virtual:nsv-islands" {
  const islands: Record<string, () => Promise<Record<string, unknown>>>;
  export default islands;
}

declare module "*?url" {
  const url: string;
  export default url;
}
