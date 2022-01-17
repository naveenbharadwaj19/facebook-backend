import { Storage } from "@google-cloud/storage";
import path from "path";
import { Buffer } from "buffer";

const __dirname = path.resolve();

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "./facebook-backend-337413-b8f987d6f33c.json"
  ),
  projectId: "facebook-backend-337413",
});

// eslint-disable-next-line valid-jsdoc
/**
 * upload image to cloud storage
 * @param  {String} folderName name of the folder in __users-photo__
 * @param  {String} fileName
 * @param {Buffer} fileBuffer
 * @return success image upload will return image url
 */
export async function uploadProfilePhotoToStorage(
  folderName,
  fileName,
  fileBuffer
) {
  const bucket = storage.bucket("users-photo");
  try {
    await bucket
      .file(folderName + "/" + fileName)
      .save(new Buffer.from(fileBuffer), { gzip: true });
    let imageUrl = await bucket
      .file(folderName + "/" + fileName)
      .getSignedUrl({ action: "read", expires: "01-01-2026"}); // expires on 2026
    return imageUrl[0];
  } catch (error) {
    console.log(`Error in uploadprofilephotostorage : ${error}`);
    let imageUrl = "";
    return imageUrl;
  }
}
