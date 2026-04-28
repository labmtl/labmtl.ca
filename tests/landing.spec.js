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

test("partner logos load correctly as img tags", async ({ page }) => {
  const logos = page.locator(".partner-logo-placeholder img");
  await expect(logos).toHaveCount(3);

  const expectedLogos = [
    "assets/logos/coderbunker.svg",
    "assets/logos/ovhcloud.svg",
    "assets/logos/cooperathon.svg",
  ];

  for (let i = 0; i < 3; i++) {
    const logo = logos.nth(i);
    await expect(logo).toBeVisible();

    const src = await logo.getAttribute("src");
    expect(src).toBe(expectedLogos[i]);

    // Check if the SVG file is accessible and loaded
    const isLoaded = await logo.evaluate(
      (img) => img.complete && img.naturalWidth > 0,
    );
    expect(isLoaded).toBe(true);
  }
});
