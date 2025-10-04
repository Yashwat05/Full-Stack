const mongoose = require("../db");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Student name is required"]
    },
    age: {
        type: Number,
        required: [true, "Student age is required"],
        min: [1, "Age must be positive"]
    },
    course: {
        type: String,
        required: [true, "Course is required"]
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
