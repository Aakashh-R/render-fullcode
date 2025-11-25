

// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js"; // optional lookup

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) token = auth.slice(7);

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // prefer to fetch full user from DB if you need accurate role
    // const user = await User.findById(decoded.id).select("-password");
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email || undefined,
      role: decoded.role || decoded.userRole || undefined
    };
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Token invalid");
  }
});


// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";

// const protect = asyncHandler(async (req, res, next) => {
//   let token = null;
//   const authHeader = req.headers.authorization || "";
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//   } else if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, token missing");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = {
//       id: decoded.id,
//       role: decoded.role || "user",
//       email: decoded.email,
//     };
//     next();
//   } catch (err) {
//     console.error("JWT verify failed", err);
//     res.status(401);
//     throw new Error("Not authorized, token invalid");
//   }
// });

// export { protect };