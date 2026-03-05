import { ErrorCodes } from "../../src/constants/error-code";
import { UserFieldRequirements } from "../../src/constants/user-field-requirements";
import { defaultUserSettings } from "../../src/constants/default-user-settings";

describe("ErrorCodes", () => {
    it("should have all expected error codes", () => {
        expect(ErrorCodes.INVALID_INPUT).toBe("ERR_INVALID_INPUT");
        expect(ErrorCodes.NOT_FOUND).toBe("ERR_NOT_FOUND");
        expect(ErrorCodes.FORBIDDEN).toBe("ERR_FORBIDDEN");
        expect(ErrorCodes.DUPLICATE).toBe("ERR_DUPLICATE");
        expect(ErrorCodes.UNAUTHORIZED).toBe("ERR_UNAUTHORIZED");
        expect(ErrorCodes.SERVER_ERROR).toBe("ERR_SERVER_ERROR");
        expect(ErrorCodes.TIMEOUT).toBe("ERR_TIMEOUT");
    });

    it("should have 7 error codes", () => {
        expect(Object.keys(ErrorCodes)).toHaveLength(7);
    });
});

describe("UserFieldRequirements", () => {
    it("should validate correct usernames", () => {
        const regex = UserFieldRequirements.username.regex;
        expect(regex.test("john_doe")).toBe(true);
        expect(regex.test("user.name")).toBe(true);
        expect(regex.test("user123")).toBe(true);
    });

    it("should reject invalid usernames", () => {
        const regex = UserFieldRequirements.username.regex;
        expect(regex.test("user name")).toBe(false);
        expect(regex.test("user@name")).toBe(false);
    });

    it("should reject weak passwords", () => {
        const regex = UserFieldRequirements.password.regex;
        expect(regex.test("password")).toBe(false);
        expect(regex.test("12345678")).toBe(false);
    });
});

describe("defaultUserSettings", () => {
    it("should have correct default values", () => {
        expect(defaultUserSettings.privacy.private_account).toBe(false);
        expect(defaultUserSettings.notifications.likes).toBe(true);
        expect(defaultUserSettings.appearance.theme).toBe("system");
        expect(defaultUserSettings.feed.mode).toBe("algorithmic");
        expect(defaultUserSettings.security.login_alerts).toBe(true);
    });
});
