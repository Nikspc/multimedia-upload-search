const request = require("supertest");
const app = require("../src/app");

describe("Auth", () => {
  test("register -> me", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({ name: "User", email: "u@test.com", password: "secret123" })
      .expect(201);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.email).toBe("u@test.com");
  });

  test("login fails with wrong password", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({ name: "User2", email: "u2@test.com", password: "secret123" })
      .expect(201);

    await agent
      .post("/api/auth/login")
      .send({ email: "u2@test.com", password: "wrong" })
      .expect(401);
  });
});