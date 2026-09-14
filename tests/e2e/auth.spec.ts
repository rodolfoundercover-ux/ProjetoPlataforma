import { test, expect } from "@playwright/test";
test.beforeAll(async ({ request }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Configure .env.local antes de testar Auth.");
  const response = await request.get(new URL("/auth/v1/settings", url).toString());
  expect(response.ok()).toBeTruthy();
  const settings = await response.json();
  expect(settings.external.email, "O provedor de e-mail deve estar ativo").toBe(true);
  expect(settings.disable_signup, "O cadastro público deve permanecer fechado").toBe(true);
});
test("anonymous user cannot access technical session", async ({ page }) => {
  await page.goto("/technical");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
});
test("invalid credentials do not grant a session", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("nonexistent@example.invalid");
  await page.getByLabel("Senha").fill("invalid-development-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Não foi possível entrar");
  await expect(page).toHaveURL(/\/login$/);
});
