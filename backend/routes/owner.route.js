import express from "express";

import { 
    getOwners, 
    createOwner, 
    updateOwner, 
    deleteOwner } from "../controller/owner.controller.js";

const router = express.Router();

router.get("/", getOwners);
router.post("/", createOwner);
router.patch("/:id", updateOwner);
router.delete("/:id", deleteOwner);

export default router;
