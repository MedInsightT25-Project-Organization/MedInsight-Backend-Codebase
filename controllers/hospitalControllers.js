const Hospital = require("../db/models/hospital");
const { validationResult } = require("express-validator");

exports.createHospital = async (req, res) => {
    const data = req.body;  
    const errors = validationResult(req); 
if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
}
const hospital_id = req.user.id;
data.createdBy = hospital_id;
const hospital = await Hospital.create(data);
res.status(201).json({ success: true, data: hospital });
}


exports.getHospitalByLocation = async (req, res) =>  {
    const { lat, lng, radius } = req.query;
    let query = {};
  
    if (lat && lng && radius) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1]
        }
      };
  }
     const hospitals = await Hospital.find(query);
     res.json(hospitals);
}
 
exports.getHospitals = async (req, res) => {
    const hospitals = await Hospital.findAll();
    res.status(200).json({ success: true, data: hospitals });
}

exports.getHospitalById = async (req, res) => {
    const hospital = await Hospital.findByPk(req.params.id);
    if (!hospital) return res.status(404).json({ success:false, message: "Hospital not found" });
    res.status(200).json({ success: true, data: hospital });
}

exports.updateHospital = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const hospital_id = req.user.id;
    data.createdBy = hospital_id;
    const hospital = await Hospital.findOne({ where: { createdBy: hospital_id } });
    if (!hospital) return res.status(404).json({ success:false, message: "Hospital not found" });
    await hospital.update(data);
    
    res.status(200).json({ success: true, data: hospital });
}

exports.deleteHospital = async (req, res) => {
    const hospital_id = req.user.id;
    const hospital = await Hospital.findOne({ where: { createdBy: hospital_id } });
    if (!hospital) return res.status(404).json({ success:false, message: "Hospital not found" });
    await hospital.destroy();
    res.status(200).json({ success: true, message: "Hospital deleted successfully" });
}
