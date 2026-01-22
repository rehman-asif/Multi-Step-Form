import express from "express";
import { FormController } from "../controllers/formController.js";
import { upload } from "../config/multer.js";
import { validate, formValidation } from "../middlewares/validation.js";
import { parseFormData } from "../middlewares/parseFormData.js";

const router = express.Router();

const uploadDocs = upload.array("documents", 5);

const validateForm = validate([
  ...formValidation.userProfile,
  ...formValidation.contactInfo,
  ...formValidation.employmentInfo,
  ...formValidation.financialInfo,
  ...formValidation.preferences,
  ...formValidation.password,
]);

router.post("/", uploadDocs, parseFormData, validateForm, FormController.create);

router.get("/", FormController.getAll);
router.get("/:id", FormController.getOne);

router.put("/:id", uploadDocs, parseFormData, FormController.update);

router.delete("/:id", FormController.delete);

export default router;
