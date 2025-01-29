import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const defaultSignOption: SignOption = {
  expiresIn: "1h",
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOption = defaultSignOption
) {
  const jwt_key = process.env.JWT_SECRET;
  const token = jwt.sign(payload, jwt_key as string, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const jwt_key = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwt_key as string);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
