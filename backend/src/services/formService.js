import FormSubmission from "../models/FormSubmission.js";
import bcrypt from "bcrypt";

export class FormService {
  static async createSubmission(formData, files = []) {
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const documents = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
    }));

    const { confirmPassword, ...dataToSave } = formData;

    const submission = new FormSubmission({
      ...dataToSave,
      password: hashedPassword,
      documents,
    });

    return submission.save();
  }

  static async getAllSubmissions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const submissions = await FormSubmission.find()
      .select("-password")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await FormSubmission.countDocuments();

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getSubmissionById(id) {
    const submission = await FormSubmission.findById(id)
      .select("-password")
      .lean();
    if (!submission) throw new Error("Submission not found");
    return submission;
  }

  static async updateSubmission(id, formData, files = []) {
    const submission = await FormSubmission.findById(id);

    if (!submission) throw new Error("Submission not found");

    if (formData.password) {
      submission.password = await bcrypt.hash(formData.password, 10);
    }

    if (files.length > 0) {
      const newDocs = files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
      }));
      submission.documents = [...(submission.documents || []), ...newDocs];
    }

    const { password, confirmPassword, documents, ...updateData } = formData;

    for (const key in updateData) {
      submission[key] = Object.assign(
        {},
        submission[key] || {},
        updateData[key],
      );
    }

    submission.updatedAt = new Date();
    return submission.save();
  }

  static async deleteSubmission(id) {
    const submission = await FormSubmission.findByIdAndDelete(id);
    
    if (!submission) throw new Error("Submission not found");
   
    return submission;
  }
}
