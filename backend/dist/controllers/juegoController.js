"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUltimoJuego = exports.insertJuego = void 0;
const pool_1 = __importDefault(require("../db/pool"));
const insertJuego = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { enunciado, habitaciones, tamanioLista, numeroObjetivo, numeroDeInicio, } = req.body;
    try {
        yield pool_1.default.query(`INSERT INTO juego (enunciado, habitaciones, tamanio_lista, numero_objetivo, numero_de_inicio)
       VALUES ($1, $2, $3, $4, $5)`, [enunciado, JSON.stringify(habitaciones), tamanioLista, numeroObjetivo, numeroDeInicio]);
        res.json({ message: 'Juego insertado correctamente' });
    }
    catch (error) {
        console.error('Error al insertar juego:', error);
        res.status(500).json({ error: 'Error al insertar el juego en la base de datos' });
    }
});
exports.insertJuego = insertJuego;
const getUltimoJuego = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool_1.default.query('SELECT * FROM juego ORDER BY fecha_creacion DESC LIMIT 1');
        if (rows.length > 0) {
            res.json(rows[0]);
        }
        else {
            res.status(404).json({ error: 'No hay registros en la base de datos' });
        }
    }
    catch (error) {
        console.error('Error al obtener el último juego:', error);
        res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }
});
exports.getUltimoJuego = getUltimoJuego;
