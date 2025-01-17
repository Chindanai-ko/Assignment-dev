import Owner from "../model/owner.model.js";

export const getOwners = async (req, res) => {
    try {
        const owners = await Owner.find({});
        res.status(200).json({ success: true, data: owners.map((owner) => ({
            _id: owner._id,
            HN: owner.HN,
            first_name: owner.first_name,
            last_name: owner.last_name,
            phone: owner.phone,
            email: owner.email,
        })),
    });
} catch (error) {
    console.error("Error in getOwners:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
}
};

export const createOwner = async (req, res) => {
    try {
        const { HN, first_name, last_name, phone, email } = req.body;

        const ownerExists = await Owner.findOne({ $or: [{ HN }, { phone }, { email }] });
        
        if (ownerExists) {
            return res.status(400).json({
                success: false,
                message: "HN, phone หรือ email ซ้ำกับข้อมูลที่มีอยู่แล้ว",
            });
        }

        if (!HN || !first_name || !last_name || !phone || !email) {
            return res.status(400).json({ success: false, message: "Please provide all the details" });
        }

        const owner = await Owner.create({
            HN,
            first_name,
            last_name,
            phone,
            email
        });
        res.status(201).json({ success: true, data: owner });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateOwner = async (req, res) => {const { id } = req.params;
const { HN, phone, email } = req.body;

try {
    const owner = await Owner.findById(id);

    if (!owner) {
        return res.status(404).json({ success: false, message: "Owner not found" });
    }

    const existingOwner = await Owner.findOne({ $or: [{ HN }, { phone }, { email }], _id: { $ne: id } });

    if (existingOwner) {
        return res.status(400).json({
            success: false,
            message: "HN, phone หรือ email ซ้ำกับข้อมูลที่มีอยู่แล้ว",
        });
    }
    
    const updatedOwner = await Owner.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: updatedOwner });    
} catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
}};

export const deleteOwner = async (req, res) => {const { id } = req.params;

    try {
        const owner = await Owner.findById(id);
        if(!owner) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        const deleteOwner = await Owner.findByIdAndDelete(id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, message: "Owner deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};