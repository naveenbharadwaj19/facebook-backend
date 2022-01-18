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
/**
 * store user profile metadata in db
 * @param  {String} body req body
 */
export async function storeUserProfileImageDb(body) {
  try {
    const collection = "profile-photos";
    await client.connect();
    const queryPhoto = await db
      .collection(collection)
      .findOne({ _id: body._id });

    if (queryPhoto === null || typeof queryPhoto === "undefined") {
      // creating a document data
      let document = {
        _id: body._id,
        photos: [
          {
            photo_id: 1,
            photo_name: body.photo_name,
            url: body.url,
            uploaded_time: body.upload_time,
            no_of_likes: body.no_of_likes,
          },
        ],
        total_photos: 1,
      };
      await db.collection(collection).insertOne(document);
      console.log("No document found.Created one");
    } else if (queryPhoto !== null) {
      let photo = {
        photo_id: queryPhoto.photos.length + 1,
        photo_name: body.photo_name,
        url: body.url,
        uploaded_time: body.upload_time,
        no_of_likes: body.no_of_likes,
      };
      let totalPhotos = queryPhoto.total_photos + 1;

      await db.collection(collection).updateOne(queryPhoto, {
        $push: { photos: photo },
        $set: { total_photos: totalPhotos },
      });
      console.log("Document found.Updated");
    }
    await client.close();
  } catch (error) {
    console.log("Error in storeUserProfileImageDb " + error.message);
  }
}

// eslint-disable-next-line valid-jsdoc
/**
 * delete user related documents in db
 * @param  {String} id - id of the document
 */
export async function deleteUserDB(id) {
  await client.connect();
  let userResult = await db.collection("users").deleteMany({ _id: id });
  let photoResult = await db
    .collection("profile-photos")
    .deleteMany({ _id: id });
  let documentsDeleted = userResult.deletedCount + photoResult.deletedCount;
  console.log(`Documents deleted : ${documentsDeleted}`);
  return documentsDeleted;
}
