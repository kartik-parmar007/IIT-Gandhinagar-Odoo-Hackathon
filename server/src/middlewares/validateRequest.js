export const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    
    // Abstract request validation middleware
    // Allows plugging in Joi, Zod, or Yup schemas later.
    try {
      // E.g. schema.parse(req.body); if using Zod
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors || error.message
      });
    }
  };
};
