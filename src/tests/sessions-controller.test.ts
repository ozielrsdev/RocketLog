import request from "supertest"
import { prisma } from "@/database/prisma"
import { app } from "@/app"

describe("Sessions Controller", () =>{
  afterAll(async()=>{
    await prisma.user.delete({
      where:{
        id: user_id
      }
    })
  })

  let user_id: string
  it("should authenticate and get user token", async ()=>{
   const userResponse = await request(app).post("/users").send({
      name: "TestAuth",
      email:"testauth@gmail.com",
      password:"testauth123"
    })

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/sessions").send({
      email:"testauth@gmail.com",
      password:"testauth123"
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})
