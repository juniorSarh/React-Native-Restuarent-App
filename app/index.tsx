import { Box, Button, Heading, VStack } from 'native-base';
import { useRouter } from 'expo-router';

export default function Landing() {
  const router = useRouter();

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack space={4}>
        <Heading>Restaurant App</Heading>
        <Button onPress={() => router.push('/screens/login')}>Login</Button>
        <Button variant="outline" onPress={() => router.push('/screens/register')}>
          Register
        </Button>
      </VStack>
    </Box>
  );
}
