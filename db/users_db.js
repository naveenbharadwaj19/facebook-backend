import { client, db } from "./mongo.js";

/**
 * check if users exists
 * @param  {Map<string,object>} body res body
 */
export async function checkUserExist(body) {
  await client.connect();
  const emalAddress = body.email_address;
  const user = await db
    .collection("users")
    .findOne({ email_address: emalAddress });
  await client.close();
  return user;
}

/**
 * store users information in the db
 * @param  {Map<string,object>} body res body
 */
export async function storeUser(body) {
  await client.connect();
  const user = await db.collection("users").insertOne(body);
  await client.close();
  return user;
}
