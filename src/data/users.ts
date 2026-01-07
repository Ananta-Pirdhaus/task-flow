// users.ts

interface User {
  username: string;
  password: string;
  role: string;
}

// Dummy user data
const users: User[] = [
  {
    username: "john_doe",
    password: "password123",
    role: "admin",
  },
  {
    username: "test1",
    password: "test123",
    role: "admin",
  },
  {
    username: "user1",
    password: "user456",
    role: "user",
  },
  {
    username: "michael_brown",
    password: "password789",
    role: "manager",
  },
];

export default users;
