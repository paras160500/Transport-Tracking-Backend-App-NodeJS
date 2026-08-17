// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import rateLimit from "express-rate-limit";
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time
  max: 100, // Each ip only can send 100 request on server
  standardHeaders: true, // REturn rate limit infor in the 'Ratelimit headers'
  legacyHeaders: false, // Disable the 'X-Ratelimit' Headers
  message: {
    message:
      "Too many Request from this IP, Please try again after 15 minutes.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time
  max: 100, // Each ip only can send 100 request on server
  standardHeaders: true, // REturn rate limit infor in the 'Ratelimit headers'
  legacyHeaders: false, // Disable the 'X-Ratelimit' Headers
  message: {
    message:
      "Too many Authetication attempts from this IP, Please try again after 15 minutes.",
  },
});

// -----------------------------------------------------------------------------------
//                                  function Statements
// -----------------------------------------------------------------------------------
