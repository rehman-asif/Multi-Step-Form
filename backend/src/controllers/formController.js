import { FormService } from '../services/formService.js';

export class FormController {
  static create = async (req, res, next) => {
    try {
      const files = req.files || []; 
      const data = await FormService.createSubmission(req.body, files);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await FormService.getAllSubmissions(page, limit);

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  static getOne = async (req, res, next) => {
    try {
      const data = await FormService.getSubmissionById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    try {
      const files = req.files || [];
      const data = await FormService.updateSubmission(req.params.id, req.body, files);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    try {
      await FormService.deleteSubmission(req.params.id);
      res.json({ success: true, message: 'Submission deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
