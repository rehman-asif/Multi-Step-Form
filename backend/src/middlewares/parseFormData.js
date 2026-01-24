export const parseFormData = (req, res, next) => {
  if (!req.body) return next();

  for (const key in req.body) {
    const value = req.body[key];

    if (value === "true") req.body[key] = true;

    else if (value === "false") req.body[key] = false;

    else if (value === "") req.body[key] = undefined;
  }

  next();
};
