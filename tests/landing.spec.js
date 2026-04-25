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

test("portfolio widget loads images correctly", async ({ page }) => {
  const slideshow = page.locator(".labmtl-slideshow");
  await expect(slideshow).toBeVisible();

  // Wait for at least one image to be injected into the slideshow
  const firstImage = slideshow.locator(".labmtl-slide img").first();
  await expect(firstImage).toBeVisible({ timeout: 15000 });

  // Check if the image is actually loaded (not broken)
  const isLoaded = await firstImage.evaluate(
    (img) => img.complete && img.naturalWidth > 0,
  );
  expect(isLoaded).toBe(true);

  // Verify the image source points to the correct CDN
  const src = await firstImage.getAttribute("src");
  expect(src).toMatch(/raw\.githack\.com\/labmtl\/assets/);
});
