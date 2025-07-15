import jwt from "jsonwebtoken";

const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (
  tokenData,
  tokenExpiry = TOKEN_EXPIRY,
  tokenKey = TOKEN_KEY
) => {
  try {
    return jwt.sign(tokenData, tokenKey, { expiresIn: tokenExpiry });
  } catch (err) {
    return err;
  }
};
