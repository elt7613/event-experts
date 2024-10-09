import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="/(auth)/sign-in" />;
};

export default index;
