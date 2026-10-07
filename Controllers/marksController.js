import marksSchema from "../Models/marksModel.js";

export const addMarks = async (req, res) => {
  try {
    const {
      studentName,
      className,
      schoolName,
      fatherName,
      dateofBirth,
      contactNumber,
      physics,
      chemistry,
      maths,
      biology,
      aptitude,
    } = req.body;

    if (!studentName || !className || !contactNumber || !dateofBirth) {
      return res.status(400).json({ message: "Student Name, Class, Contact Number and Date of Birth are required." });
    }

    const parseSubjectMark = (val, subjectName) => {
      const num = Number(val);
      if (isNaN(num)) return 0;
      if (num < 0 || num > 10) {
        throw new Error(`${subjectName} marks must be between 0 and 10 (got ${val}).`);
      }
      return num;
    };

    let p, c, m, b, a;
    try {
      p = parseSubjectMark(physics, "Physics");
      c = parseSubjectMark(chemistry, "Chemistry");
      m = parseSubjectMark(maths, "Maths");
      b = parseSubjectMark(biology, "Biology");
      a = parseSubjectMark(aptitude, "Aptitude");
    } catch (valErr) {
      return res.status(400).json({ message: valErr.message });
    }

    const totalNum = p + c + m + b + a;
    const percentage = Number(((totalNum / 50) * 100).toFixed(2));

    const dob = new Date(dateofBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: "Invalid Date of Birth format. Please provide a valid date." });
    }

    const newMarks = await marksSchema.create({
      studentName: studentName.trim(),
      className: className.trim(),
      schoolName: schoolName ? schoolName.trim() : "",
      fatherName: fatherName ? fatherName.trim() : "",
      dateofBirth: dob,
      contactNumber: String(contactNumber).trim(),
      physics: p,
      chemistry: c,
      maths: m,
      biology: b,
      aptitude: a,
      total: totalNum,
      percentage,
    });

    res.status(201).json(newMarks);
  } catch (error) {
    console.error("Error adding marks:", error);
    res.status(500).json({ message: error.message || "Server error while adding marks", error: error.message });
  }
};

export const getAllMarks = async (req, res) => {
  try {
    const marks = await marksSchema.find().sort({ createdAt: -1 }); // ✅ Recent first
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteMarks = async (req, res) => {
  try {
    await marksSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const parseSubjectMark = (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const p = parseSubjectMark(data.physics);
    const c = parseSubjectMark(data.chemistry);
    const m = parseSubjectMark(data.maths);
    const b = parseSubjectMark(data.biology);
    const a = parseSubjectMark(data.aptitude);

    const totalNum = p + c + m + b + a;
    const percentage = Number(((totalNum / 50) * 100).toFixed(2));

    data.physics = p;
    data.chemistry = c;
    data.maths = m;
    data.biology = b;
    data.aptitude = a;
    data.total = totalNum;
    data.percentage = percentage;

    if (data.dateofBirth) {
      const dob = new Date(data.dateofBirth);
      if (!isNaN(dob.getTime())) {
        data.dateofBirth = dob;
      }
    }

    const updated = await marksSchema.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error", error: error.message });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const { studentName, contactNumber, dateofBirth } = req.body;

    if (!studentName || !contactNumber || !dateofBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const searchDate = new Date(dateofBirth);
    let dateQuery = dateofBirth;

    if (!isNaN(searchDate.getTime())) {
      const startOfDay = new Date(searchDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(searchDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      dateQuery = { $gte: startOfDay, $lte: endOfDay };
    }

    const record = await marksSchema.findOne({
      studentName: { $regex: new RegExp(`^${studentName.trim()}$`, "i") }, // case-insensitive match
      contactNumber: contactNumber.trim(),
      $or: [
        { dateofBirth: dateQuery },
        { dateofBirth: searchDate }
      ]
    });

    if (!record) {
      return res.status(404).json({ message: "No student record found" });
    }

    res.status(200).json(record);

  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};