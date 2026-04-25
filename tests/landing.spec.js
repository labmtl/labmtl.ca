import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Assuming the page is served on localhost:8081
  await page.goto("http://localhost:8081");
});

test("landing page has correct title and hero", async ({ page }) => {
  await expect(page).toHaveTitle(/labmtl/);

  const heroTitle = page.locator(".hero-content h1");
  await expect(heroTitle).toBeVisible();
  await expect(heroTitle).toContainText("Innover pour la Communauté");
});

test("projects and partners sections are present", async ({ page }) => {
  const projects = page.locator("#projets .project-card");
  await expect(projects).toHaveCount(7);

  const partners = page.locator("#partenaires .partner-item");
  await expect(partners).toHaveCount(3);
});

test("portfolio widget is integrated", async ({ page }) => {
  const slideshow = page.locator(".labmtl-slideshow");
  await expect(slideshow).toBeVisible();
  await expect(slideshow).toHaveAttribute("data-manifest", /manifest.json/);
});
