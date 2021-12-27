import { Router } from "express";
import { checkUserExist, storeUser } from "../db/users_db.js";
import { resJson } from "../models/res_json.js";
import { userLogInSchema, userSignUpSchema } from "../schemas/user_schema.js";
import _ from "lodash";
import { hashPassword, validatePassword } from "../models/hash.js";

export const route = Router();

route.post("/signup", async (req, res) => {
  const validate = userSignUpSchema.validate(req.body);

  if (validate.error) return resJson(res, 400, validate.error.message);

  var user = await checkUserExist(validate.value);
  if (user) return resJson(res, 400, "User account exists.try logging in");

  validate.value.password = await hashPassword(validate.value.password);
  await storeUser(validate.value);

  resJson(res, 200, _.pick(validate.value, ["_id", "name", "email_address"]));
});

route.post("/login", async (req, res) => {
  const validate = userLogInSchema.validate(req.body);

  if (validate.error) return resJson(res, 400, validate.error.message);

  var user = await checkUserExist(validate.value);
  if (!user) return resJson(res, 400, "Invalid email or password"); // email validator

  const result = await validatePassword(validate.value.password, user.password);

  if (!result) return resJson(res, 400, "Invalid email or password");

  resJson(res, 200, result);
});
