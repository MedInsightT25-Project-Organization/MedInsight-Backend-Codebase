const Hospital = require("../models/Hospital");
const { validationResult } = require("express-validator");

exports.createHospital = async (req, res) => {
    const hospital = new Hospital(req.body);
    await hospital.save();
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
    const hospitals = await Hospital.find();
    res.status(200).json({ success: true, data: hospitals });
}

exports.getHospitalById = async (req, res) => {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });
    res.status(200).json({ success: true, data: hospital });
}

exports.updateHospital = async (req, res) => {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: hospital });
}

exports.deleteHospital = async (req, res) => {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: hospital });
}
