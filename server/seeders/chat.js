import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker";

export const createSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromises = [];

    for (let i = 0; i < users.length; i++) {
      for (
        let j = i + 1;
        j < users.length && chatsPromises.length < numChats;
        j++
      ) {
        chatsPromises.push(
          Chat.create({
            name: faker.lorem.words(2),
            groupChat: false, // Ensure it's a single chat
            creator: users[i]._id, // Set the first user as the creator
            members: [users[i]._id, users[j]._id], // Add both users as members
          })
        );
      }
    }

    await Promise.all(chatsPromises);
    console.log("Single chats created");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromises = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({
        min: 3,
        max: users.length,
      });

      const members = [];

      while (members.length < numMembers) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        if (!members.includes(randomUser._id)) {
          members.push(randomUser._id);
        }
      }

      const creator = members[0];

      // Add group chat creation with unique groupAdmin
      chatsPromises.push(
        Chat.create({
          groupChat: true,
          name: faker.lorem.word(1),
          members: members,
          creator: creator,
          groupAdmin: [creator], // Set the first member as the group admin
        })
      );
    }

    await Promise.all(chatsPromises);
    console.log("Group chats created");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createMessage = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagesPromises = [];
    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromises.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromises);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createMessageInChat = async (chatId, numMessage) => {
  try {
    const users = await User.find().select("_id");
    const messagePromise = [];

    for (let i = 0; i < numMessage; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagePromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagePromise);

    process.exit();
  } catch (error) {
    process.exit(1);
  }
};
