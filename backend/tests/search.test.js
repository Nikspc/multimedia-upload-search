const request = require("supertest");
const app = require("../src/app");
const MediaFile = require("../src/models/MediaFile");

describe("Search", () => {
  test("search returns matching by tag and filename", async () => {
    const agent = request.agent(app);

    // create user session
    const reg = await agent
      .post("/api/auth/register")
      .send({ name: "S", email: "s@test.com", password: "secret123" })
      .expect(201);

    const userId = reg.body.user.id;

    // seed files for this user
    await MediaFile.create([
      {
        owner: userId,
        originalName: "holiday_photo.png",
        tags: ["travel", "nature"],
        cloudinaryPublicId: "x1",
        secureUrl: "https://example.com/1",
        mimeType: "image/png",
        resourceType: "image",
        bytes: 123
      },
      {
        owner: userId,
        originalName: "meeting_notes.pdf",
        tags: ["work"],
        cloudinaryPublicId: "x2",
        secureUrl: "https://example.com/2",
        mimeType: "application/pdf",
        resourceType: "raw",
        bytes: 456
      }
    ]);

    // search by tag
    const r1 = await agent
      .get("/api/files/search")
      .query({ query: "travel", sort: "relevance" })
      .expect(200);

    expect(r1.body.files.length).toBe(1);
    expect(r1.body.files[0].originalName).toBe("holiday_photo.png");

    // search by filename part
    const r2 = await agent
      .get("/api/files/search")
      .query({ query: "meeting", sort: "relevance" })
      .expect(200);

    expect(r2.body.files.length).toBe(1);
    expect(r2.body.files[0].originalName).toBe("meeting_notes.pdf");
  });
});