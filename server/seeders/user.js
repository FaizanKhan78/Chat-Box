import { faker } from "@faker-js/faker";
import { User } from "../models/user.js";

export const createUser = async (numUsers) => {
  try {
    const userPromises = [];
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "password",
        bio: faker.lorem.sentence(10),
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      userPromises.push(tempUser);
    }

    await Promise.all(userPromises);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
