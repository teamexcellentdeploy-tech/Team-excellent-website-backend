import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    className: { type: String, required: true },
    schoolName: { type: String, required: true },
    fatherName: { type: String, required: true },
    dateofBirth: { type: Date, required: true },
    contactNumber: { type: String, required: true },

    physics: { type: Number, required: true, min: 0, max: 10 },
    chemistry: { type: Number, required: true, min: 0, max: 10 },
    maths: { type: Number, required: true, min: 0, max: 10 },
    biology: { type: Number, required: true, min: 0, max: 10 },
    aptitude: { type: Number, required: true, min: 0, max: 10 },

    total: { type: Number, required: true },
    percentage: { type: Number },
    scholarshipPercent: { type: Number, required: true }
  },
  { timestamps: true } 
);

export default mongoose.model("marks", marksSchema);
