import { app } from "@/app";
import { prisma } from "@/database/prisma";
import request from "supertest";

describe("Users Controllers", () => {
	let user_id: string;

	afterAll(async () => {
		await prisma.user.delete({
			where: {
				id: user_id,
			},
		});
	});

	it("should create a new user successfully", async () => {
		const response = await request(app).post("/users").send({
			name: "Test User",
			email: "testuser@gmail.com",
			password: "teste123456",
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toBe("Test User");

		user_id = response.body.id;
	});
  it("should throw an error if user with same email already exists", async ()=>{
    const response = await request(app).post("/users").send({
			name: "Duplicate User",
			email: "testuser@gmail.com",
			password: "teste123456",
		});


    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User with same email alredy exists!")
  })
  it("should throw a validation erro if email is invalid", async()=>{
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "12341255123",
      password: "teste1234"
    })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation error")

  })
});
