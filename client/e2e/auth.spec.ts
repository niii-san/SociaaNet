import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("should render the login form with all fields", async ({ page }) => {
        await expect(page.getByText("Welcome back")).toBeVisible();
        await expect(
            page.getByText("Sign in to continue to your account")
        ).toBeVisible();

        // Form fields
        await expect(page.getByLabel("Email Address")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();

        // Submit button (the one inside the form with type=submit)
        await expect(
            page.locator('button[type="submit"]', { hasText: /sign in/i })
        ).toBeVisible();
    });

    test("should show validation errors for empty form submission", async ({
        page
    }) => {
        await page.locator('button[type="submit"]', { hasText: /sign in/i }).click();

        // Zod validation triggers on empty fields
        await expect(page.getByText("Email is required")).toBeVisible();
        await expect(page.getByText("Password is required")).toBeVisible();
    });

    test("should have a link to the register page", async ({ page }) => {
        const signUpLink = page.getByRole("link", {
            name: /sign up for free/i
        });
        await expect(signUpLink).toBeVisible();
        await signUpLink.click();
        await expect(page).toHaveURL(/\/register/);
    });

    test("should have a forgot password link", async ({ page }) => {
        const forgotLink = page.getByRole("link", {
            name: /forgot password/i
        });
        await expect(forgotLink).toBeVisible();
        await expect(forgotLink).toHaveAttribute("href", "/forgot-password");
    });
});

test.describe("Register Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/register");
    });

    test("should render the register form with all fields", async ({
        page
    }) => {
        await expect(page.getByText("Create an account")).toBeVisible();
        await expect(
            page.getByText("Enter your details below to get started")
        ).toBeVisible();

        // Form fields
        await expect(page.getByLabel("Full Name")).toBeVisible();
        await expect(page.getByLabel("Email Address")).toBeVisible();
        await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
        await expect(page.getByLabel("Confirm Password")).toBeVisible();

        // Terms checkbox
        await expect(
            page.getByText(/I agree to the Terms of Service/i)
        ).toBeVisible();

        // Submit button (the one inside the form with type=submit)
        await expect(
            page.locator('button[type="submit"]', { hasText: /create account/i })
        ).toBeVisible();
    });

    test("should show validation errors for empty form submission", async ({
        page
    }) => {
        await page
            .locator('button[type="submit"]', { hasText: /create account/i })
            .click();

        // Validation messages should appear
        await expect(
            page.getByText("Full name must be at least 2 characters")
        ).toBeVisible();
        await expect(page.getByText("Email is required")).toBeVisible();
        await expect(page.getByText("Password is required")).toBeVisible();
    });

    test("should have a link to the login page", async ({ page }) => {
        // Use the text link at the bottom of the form, not the navbar
        const signInLink = page.getByRole("link", {
            name: "Sign in",
            exact: true
        });
        await expect(signInLink).toBeVisible();
        await signInLink.click();
        await expect(page).toHaveURL(/\/login/);
    });
});
