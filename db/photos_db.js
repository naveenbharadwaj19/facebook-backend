import { client, db } from "./mongo.js";

// eslint-disable-next-line require-jsdoc
export async function fetchUsersProfilePhotos() {
  let photos = [];
  await client.connect();
  let photosDoc = db.collection("profile-photos").find({});
  await photosDoc.forEach((photo) => photos.push(photo));
  await client.close();
  return photos;
}
