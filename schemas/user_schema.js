import Joi from "joi";

export const userSignUpSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().min(4).required(),
  age: Joi.number().integer().greater(18).required(),
  email_address: Joi.string().min(4).email().required(),
  password: Joi.string().min(6).trim().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  account_created_time: Joi.date().required(),
});

export const userLogInSchema = Joi.object({
  email_address: Joi.string().min(4).email().required(),
  password: Joi.string().min(6).trim().required(),
});

export const UserProfilePhotosSchema = Joi.object({
  _id: Joi.string().required(),
  photo_name: Joi.string().required(),
  url: Joi.string()
    .regex(/\b(http|https)/)
    .required(),
  upload_time: Joi.date().default(Date.now()),
  no_of_likes: Joi.number().integer().required(),
});
