// import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Page = () => {
  // const { isSignedIn } = useAuth();

  if (!true) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/sign-up" />;
};

export default Page;
