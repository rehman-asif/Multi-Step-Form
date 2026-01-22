import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    userProfile: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
    },
    contactInfo: {
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    employmentInfo: {
      employmentStatus: {
        type: String,
        enum: ["Employed", "Unemployed", "Self-Employed", "Student"],
        required: true,
      },
      companyName: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      monthlyIncome: { type: Number, default: 0 },
    },
    financialInfo: {
      loanStatus: { type: String, enum: ["Yes", "No"], required: true },
      loanAmount: { type: Number, default: 0 },
      creditScore: { type: Number, min: 300, max: 850 },
      bankName: { type: String, default: "" },
    },
    preferences: {
      newsletter: { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
      communicationMethod: {
        type: String,
        enum: ["Email", "Phone", "SMS"],
        default: "Email",
      },
      termsAccepted: { type: Boolean, required: true },
    },
    documents: [
      {
        filename: { type: String },
        originalName: { type: String },
        path: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    password: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

formSubmissionSchema.index({ submittedAt: -1 });

export default mongoose.model("FormSubmission", formSubmissionSchema);
