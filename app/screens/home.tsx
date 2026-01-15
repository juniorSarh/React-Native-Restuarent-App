import { Box, Heading, Button } from 'native-base';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Heading mb="4">Welcome 🎉</Heading>
      <Button onPress={() => router.replace('/')}>Logout</Button>
    </Box>
  );
}
