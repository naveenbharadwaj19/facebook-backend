/**
 *  response sent to client with json
 * @param  {Response} res - express response
 * @param  {Number} statusCode - status __(200,400,500...)__
 * @param {Map<String,Any>} message - message to be sent
 */
export function resJson(res, statusCode, message) {
  res.status(statusCode).json({
    status: res.statusCode,
    message: message,
  });
}
