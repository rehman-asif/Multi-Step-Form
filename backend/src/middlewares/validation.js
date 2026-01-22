import { body, validationResult } from "express-validator";

export const validate = (rules) => {
  return async (req, res, next) => {
    for (const rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  };
};

export const formValidation = {
  userProfile: [
    body("userProfile.firstName").notEmpty().withMessage("First name required"),
    body("userProfile.lastName").notEmpty().withMessage("Last name required"),
    body("userProfile.dateOfBirth").isISO8601(),
    body("userProfile.gender").isIn(["Male", "Female", "Other"]),
  ],

  contactInfo: [
    body("contactInfo.email").isEmail(),
    body("contactInfo.phone").notEmpty(),
    body("contactInfo.address").notEmpty(),
    body("contactInfo.city").notEmpty(),
    body("contactInfo.state").notEmpty(),
    body("contactInfo.zipCode").notEmpty(),
  ],

  employmentInfo: [
    body("employmentInfo.employmentStatus").isIn([
      "Employed",
      "Unemployed",
      "Self-Employed",
      "Student",
    ]),
    body("employmentInfo.companyName")
      .if(body("employmentInfo.employmentStatus").equals("Employed"))
      .notEmpty(),
    body("employmentInfo.monthlyIncome").optional().isNumeric(),
  ],

  financialInfo: [
    body("financialInfo.loanStatus").isIn(["Yes", "No"]),
    body("financialInfo.loanAmount")
      .if(body("financialInfo.loanStatus").equals("Yes"))
      .isNumeric(),
    body("financialInfo.creditScore").optional().isInt({
      min: 300,
      max: 850,
    }),
  ],

  preferences: [
    body("preferences.termsAccepted").custom((v) => {
      if (v === true || v === "true") return true;
      throw new Error("Terms must be accepted");
    }),
  ],

  password: [
    body("password").isLength({ min: 6 }),
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
};
