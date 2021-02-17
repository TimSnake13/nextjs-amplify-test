import { Flex, Link, Button } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { AmplifySignOut } from "@aws-amplify/ui-react";

interface Props {
  user: string;
}

const Navbar = ({ user }: Props) => {
  const router = useRouter();
  const marginLeft = "4";
  async function signOut() {
    try {
      router.push("/");
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <Flex>
      <NextLink href="/">
        <Link ml={marginLeft} marginY="auto">
          Home
        </Link>
      </NextLink>
      <NextLink href="/dashboard">
        <Link ml={marginLeft} marginY="auto" marginRight="auto">
          Dashboard
        </Link>
      </NextLink>
      {/* <Button ml={marginLeft} onClick={() => signOut()}>
        Sign Out
      </Button> */}
      {user && <AmplifySignOut />}
    </Flex>
  );
};

export default Navbar;
