import * as argon2 from 'argon2';

const HASH_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, HASH_OPTIONS);
}

export async function verifyPassword(
  hashPassword: string,
  plainPassword: string,
): Promise<boolean> {
  return argon2.verify(hashPassword, plainPassword);
}
