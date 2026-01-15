import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
};

const USERS_KEY = '@users';

export const registerUser = async (user: User) => {
  const storedUsers = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

  const userExists = users.find(u => u.email === user.email);
  if (userExists) {
    throw new Error('User already exists');
  }

  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginUser = async (email: string, password: string) => {
  const storedUsers = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return user;
};
