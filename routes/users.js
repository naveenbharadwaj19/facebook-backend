import { Router } from "express";
import {
  checkUserExist,
  storeUser,
  storeUserProfileImageDb as storeUserProfileImageDb,
} from "../db/users_db.js";
import { resJson } from "../models/res_json.js";
import {
  userLogInSchema,
  UserProfilePhotosSchema,
  userSignUpSchema,
} from "../schemas/user_schema.js";
import _ from "lodash";
import { hashPassword, validatePassword } from "../models/hash.js";
import { uploadImage } from "../models/upload_image.js";
import { uploadProfilePhotoToStorage } from "../models/gc_storage.js";
import { fetchUsersProfilePhotos } from "../db/photos_db.js";

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

route.post("/profile/photos", uploadImage.single("image"), async (req, res) => {
  if (typeof req.file === "undefined")
    return resJson(res, 400, "No image found");

  let imageUrl = await uploadProfilePhotoToStorage(
    "profile-photos",
    req.file.originalname.replace(/ /g, "_"),
    req.file.buffer
  );

  if (imageUrl.length === 0) return resJson(res, 502, "failed");

  let body = _.pick(req.body, ["_id", "upload_time", "no_of_likes"]);

  body.url = imageUrl;
  body.no_of_likes = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  body.photo_name = req.file.originalname;

  let validatePhoto = UserProfilePhotosSchema.validate(body);

  if (validatePhoto.error)
    return resJson(res, 400, validatePhoto.error.message);

  storeUserProfileImageDb(validatePhoto.value);

  resJson(res, 200, imageUrl);
});

route.get("/profile/photos", async (req, res) => {
  let photos = await fetchUsersProfilePhotos();
  resJson(res, 200, photos);
});
