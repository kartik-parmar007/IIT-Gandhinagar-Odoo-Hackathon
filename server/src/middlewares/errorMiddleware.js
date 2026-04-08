export const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware Caught:", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  
  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
