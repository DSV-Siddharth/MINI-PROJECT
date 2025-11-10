// src/utils/helpers.js

// Example: Format a standard JSON response
function formatResponse(success, data, message) {
  return {
    success,
    data,
    message,
  };
}

// Example: Validate required fields
function validateFields(obj, fields) {
  return fields.every(field => obj[field] !== undefined && obj[field] !== null && obj[field] !== "");
}

// Example: Capitalize a string
function capitalize(str) {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  formatResponse,
  validateFields,
  capitalize,
};
