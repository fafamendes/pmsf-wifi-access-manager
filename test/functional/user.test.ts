import { User } from '@src/models/users';

describe("User funcional tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  it("should create a new user", async () => {
    const { body, status } = await global.testRequest.post("/users")

      .send({
        name: "John Doe",
        username: "johndoe",
        password: "password",
        role: "ADMIN"
      })

    expect(status).toBe(200)

  })


})