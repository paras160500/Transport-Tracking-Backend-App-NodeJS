// -----------------------------------------------------------------------------------
//                              Error Handling Statements
// -----------------------------------------------------------------------------------

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
};

export const errorHandler = (err, req, res, next) => {
  console.log("Error ", err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};
