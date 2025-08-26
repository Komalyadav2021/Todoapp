module.exports = function (req, res, next) {
  const { title, due_date } = req.body;

  // Validate title (must be a string, at least 3 non-space characters)
  if (
    !title ||
    typeof title !== "string" ||
    title.trim().length < 3
  ) {
    return res.status(400).json({
      error: "Invalid or missing 'title'. It must be at least 3 characters long."
    });
  }

  // Validate due_date if provided (optional but must be a valid date if present)
  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        error: "Invalid 'due_date'. Must be a valid date string."
      });
    }
  }

  next(); // Input is valid
};
