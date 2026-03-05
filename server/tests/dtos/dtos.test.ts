import { CreateUserDto } from "../../src/dtos/users/create-user.dto";
import { LoginDto } from "../../src/dtos/auth/login.dto";
import { UpdateUsernameDto } from "../../src/dtos/users/update-username.dto";

describe("CreateUserDto", () => {
    it("should map body fields correctly", () => {
        const dto = new CreateUserDto({
            full_name: "John Doe",
            email_address: "john@example.com",
            password: "Password@123"
        });
        expect(dto.fullName).toBe("John Doe");
        expect(dto.emailAddress).toBe("john@example.com");
        expect(dto.password).toBe("Password@123");
    });
});

describe("LoginDto", () => {
    it("should map body fields correctly", () => {
        const dto = new LoginDto({
            email_address: "user@test.com",
            password: "pass123",
            ip: "127.0.0.1",
            device: "Chrome"
        });
        expect(dto.emailAddress).toBe("user@test.com");
        expect(dto.password).toBe("pass123");
        expect(dto.ip).toBe("127.0.0.1");
        expect(dto.device).toBe("Chrome");
    });
});

describe("UpdateUsernameDto", () => {
    it("should set userId and username", () => {
        const dto = new UpdateUsernameDto("user123", "new_username");
        expect(dto.userId).toBe("user123");
        expect(dto.username).toBe("new_username");
    });
});
