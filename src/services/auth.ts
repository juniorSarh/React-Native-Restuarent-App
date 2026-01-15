// Mock authentication service for development
export const registerUser = async (user: {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.email && user.password && user.name && user.surname) {
        resolve({ user: { email: user.email, name: user.name, uid: 'mock-user-id' } });
      } else {
        reject(new Error('All fields are required'));
      }
    }, 1000);
  });
};

export const loginUser = async (email: string, password: string) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve({ user: { email, name: 'Test User', uid: 'mock-user-id' } });
      } else if (email && password) {
        resolve({ user: { email, name: 'Demo User', uid: 'mock-user-id' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};
