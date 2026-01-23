export const parseFormData = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') return next();

  const convert = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return value;
  };

  const traverse = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key,
        typeof val === 'object' ? traverse(val) : convert(val),
      ])
    );
  };

  req.body = traverse(req.body);
  next();
};
