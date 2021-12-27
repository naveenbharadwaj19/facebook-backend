/* eslint-disable require-jsdoc */
export function errorMiddleWare(error, req, res, next) {
  res.status(500).json({
    status: res.statusCode,
    message: error.message,
  });
}
