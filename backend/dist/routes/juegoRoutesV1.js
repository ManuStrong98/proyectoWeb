"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const juegoController_1 = require("../controllers/juegoController");
const router = (0, express_1.Router)();
router.post('/', juegoController_1.insertJuego);
router.get('/ultimo', juegoController_1.getUltimoJuego);
exports.default = router;
