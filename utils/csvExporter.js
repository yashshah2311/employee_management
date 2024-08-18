const { Parser } = require('json2csv');

exports.exportEmployeesToCSV = (employees) => {
  const parser = new Parser({
    fields: ['name', 'email', 'phone', 'address', 'companyName', 'experience', 'department', 'joiningDate']
  });
  return parser.parse(employees);
};