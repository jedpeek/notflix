import { mAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "@/lib/cookies";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";

      // console.log({ didToken, auth });

      const metadata = await mAdmin.users.getMetadataByToken(didToken);

      // console.log({ metadata });

      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.HASURA_SECRET_KEY
      );
      console.log("Waffles", { token });
      const isNewUserQuery = await isNewUser(token, metadata.issuer);

      isNewUserQuery && (await createNewUser(token, metadata));
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.error("Something went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
