import bcrypt from "bcrypt";
/**
 * convert plain text to hash
 * @param  {string} password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

/**
 * validate password
 * @param  {string} password plain text password
 * @param {string} hashedPassword hashed password
 */
export async function validatePassword(password, hashedPassword) {
  const validate = await bcrypt.compare(password, hashedPassword);
  return validate;
}
