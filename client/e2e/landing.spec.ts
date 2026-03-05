import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should display the navbar with SociaaNet branding", async ({
        page
    }) => {
        const navbar = page.locator("nav");
        await expect(navbar).toBeVisible();
        await expect(navbar.getByText("SociaaNet")).toBeVisible();
    });

    test("should display hero section with heading and CTAs", async ({
        page
    }) => {
        // Check the main heading contains the key words
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
        await expect(heading).toContainText("Connect");
        await expect(heading).toContainText("Create");
        await expect(heading).toContainText("Share");

        const getStartedBtn = page.getByRole("link", {
            name: /get started/i
        });
        await expect(getStartedBtn).toBeVisible();
        await expect(getStartedBtn).toHaveAttribute("href", "/register");

        const githubBtn = page.getByRole("link", {
            name: /view on github/i
        });
        await expect(githubBtn).toBeVisible();
    });

    test("should display the features section with 6 feature cards", async ({
        page
    }) => {
        const featuresSection = page.locator("#features");
        await expect(featuresSection).toBeVisible();
        await expect(
            featuresSection.getByText("Everything you need to connect")
        ).toBeVisible();

        // Verify all 6 features are listed
        const features = [
            "Real-Time Chat",
            "Reels & Video",
            "Smart Feed",
            "Live Notifications",
            "Privacy Controls",
            "Follow System"
        ];
        for (const feature of features) {
            await expect(featuresSection.getByText(feature)).toBeVisible();
        }
    });

    test("should display the footer with navigation links", async ({
        page
    }) => {
        const footer = page.locator("footer");
        await expect(footer).toBeVisible();

        // Check the brand link in footer
        await expect(
            footer.getByRole("link", { name: "SociaaNet", exact: true })
        ).toBeVisible();

        // Footer should have account links
        await expect(
            footer.getByRole("link", { name: "Create Account" })
        ).toBeVisible();
        await expect(
            footer.getByRole("link", { name: "Sign In" })
        ).toBeVisible();
        await expect(
            footer.getByRole("link", { name: "Forgot Password" })
        ).toBeVisible();
    });

    test("should have working Sign In navbar link that navigates to /login", async ({
        page
    }) => {
        const signInBtn = page
            .locator("nav")
            .getByRole("link", { name: /sign in/i });
        await expect(signInBtn).toBeVisible();
        await signInBtn.click();
        await expect(page).toHaveURL(/\/login/);
    });

    test("should display trust signals (free, no ads, open source)", async ({
        page
    }) => {
        await expect(page.getByText("100% Free forever")).toBeVisible();
        await expect(page.getByText("No ads or tracking")).toBeVisible();
        await expect(
            page.getByText("Open source", { exact: true })
        ).toBeVisible();
    });

    test("should display community section with value propositions", async ({
        page
    }) => {
        const communitySection = page.locator("#community");
        await expect(communitySection).toBeVisible();
        await expect(
            communitySection.getByText("Built for people, not profits")
        ).toBeVisible();

        // Check stat cards
        await expect(communitySection.getByText("Zero")).toBeVisible();
        await expect(communitySection.getByText("100%")).toBeVisible();
        await expect(
            communitySection.getByText("Open", { exact: true })
        ).toBeVisible();
        await expect(
            communitySection.getByText("Free", { exact: true })
        ).toBeVisible();
    });
});
