const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message.replace(//g, '')).join('. ');
 return res.status(400).json({ success: false, message: messages });
 }
 req.body = value;
 next();
 };
};
module.exports = validateRequest;
