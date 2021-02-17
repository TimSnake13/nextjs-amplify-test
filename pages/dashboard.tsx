import React, { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { CognitoUser } from "@aws-amplify/auth";
import { Auth } from "aws-amplify";
import Navbar from "../src/components/Navbar";

export interface UserAttributes {
  sub: string;
  email: string;
}

export interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
}

const dashboard = () => {
  const [user, setUser] = useState<CognitoUserExt | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const authenticatedUser: CognitoUserExt | null = await Auth.currentAuthenticatedUser();
      console.log(authenticatedUser);
      setUser(authenticatedUser);
    };
    getUser();
  }, []);
  return (
    <>
      <Navbar user={user?.attributes?.sub} />
      <div>This is dashboard</div>
    </>
  );
};

export default withAuthenticator(dashboard);
