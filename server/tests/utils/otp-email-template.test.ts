import { otpEmailTemplate } from "../../src/utils/otp-email-template";

describe("otpEmailTemplate", () => {
    it("should include the OTP code in the template", () => {
        const html = otpEmailTemplate("123456", "John Doe");
        expect(html).toContain("123456");
    });

    it("should include the user's full name", () => {
        const html = otpEmailTemplate("999999", "Jane Smith");
        expect(html).toContain("Jane Smith");
    });
});
