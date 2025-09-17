import apiError from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return next(new apiError(error.details[0].message, 400));
  next();
};
