const request = require("supertest");
const app = require("./app");

describe("Post User Endpoint", () => {
  it("should create a new User", async () => {
    const res = await request(app).post("/api/v1/users/").send({
      first_name: "test",
      last_name: "test",
      email: "email@gmail.com",
      password: "test",
      age: 24,
    });
    console.log(res.statusCode);
    expect(res.statusCode).toBe(201);
  });
});
describe("get Endpoints", () => {
  it("should get  user", async () => {
    const res = await request(app).get("/api/v1/users/A4");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    console.log(res.body);
  });
});

describe("update Endpoints", () => {
  it("should update a givin user", async () => {
    const res = await request(app).put("/api/v1/users/A6").send({
      id: "A5",
      first_name: "first_nameA1_updated",
      last_name: "last_nameA1_updated",
      email: "first_nameA1_updated@gmail.com",
      password: "passwordA1",
      age: 22,
    });
    expect(res.statusCode).toBe(200);
    console.log(res.body);
  });
});

describe("delete Endpoints", () => {
  it("should delete user", async () => {
    const res = await request(app).delete("/api/v1/users/A5");
    expect(res.statusCode).toBe(204);
    console.log(res.body);
  });
});
