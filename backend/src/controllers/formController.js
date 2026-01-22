import { FormService } from "../services/formService.js";

export class FormController {

  static create = async (req, res, next) => {
    try {
      const data = await FormService.createSubmission(req.body, req.files || []);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      res.json({
        success: true,
        ...(await FormService.getAllSubmissions(page, limit))
      });
    } catch (e) {
      next(e);
    }
  };

  static getOne = async (req, res, next) => {
    try {
      res.json({
        success: true,
        data: await FormService.getSubmissionById(req.params.id)
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      res.json({
        success: true,
        data: await FormService.updateSubmission(
          req.params.id,
          req.body,
          req.files || []
        )
      });
    } catch (e) {
      next(e);
    }
  };

  static delete = async (req, res, next) => {
    try {
      await FormService.deleteSubmission(req.params.id);
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  };
}
