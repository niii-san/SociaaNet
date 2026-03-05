import { test, expect } from "@playwright/test";

test.describe("Forgot Password Page", () => {
    test("should render the forgot password form", async ({ page }) => {
        await page.goto("/forgot-password");

        await expect(page.getByText("Forgot Password")).toBeVisible();
        await expect(
            page.getByText(
                "Enter your email to receive a password reset OTP"
            )
        ).toBeVisible();

        // Email field and submit button
        await expect(page.getByLabel("Email Address")).toBeVisible();
        await expect(
            page.getByRole("button", { name: /request otp/i })
        ).toBeVisible();

        // Back to login link
        await expect(
            page.getByRole("link", { name: /back to login/i })
        ).toBeVisible();
    });

    test("should navigate back to login page", async ({ page }) => {
        await page.goto("/forgot-password");

        const backLink = page.getByRole("link", {
            name: /back to login/i
        });
        await backLink.click();
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe("Page Navigation", () => {
    test("should navigate from landing to register via final CTA", async ({
        page
    }) => {
        await page.goto("/");

        // Scroll to the final CTA and click "Create Your Account"
        const ctaLink = page.getByRole("link", {
            name: /create your account/i
        });
        await ctaLink.scrollIntoViewIfNeeded();
        await ctaLink.click();
        await expect(page).toHaveURL(/\/register/);
    });

    test("should return 404 for non-existent pages", async ({ page }) => {
        const response = await page.goto("/this-page-does-not-exist");
        expect(response?.status()).toBe(404);
    });
});
