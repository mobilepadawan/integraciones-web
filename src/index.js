import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { productosElectronicos } from "../database/productos.js";

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de ejemplo",
            version: "1.0.0",
            description: "Documentación de ejemplo para Teclab.",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Servidor local",
            },
        ],
    },
    apis: ["./src/index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ruta de prueba de la API
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida si la API está funcionando correctamente.
 */
app.get("/", (req, res) => {

    return res.status(200).send({ success: true, message: "¡Hola Mundo!" });
});

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtiene todos los productos.
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 */
app.get("/productos", (req, res) => {
    try {
        return res.status(200).json(productosElectronicos);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos."
        });
    }
});

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a obtener.
 *     responses:
 *       200:
 *         description: Producto obtenido correctamente.
 *       404:
 *         description: Producto no encontrado.
 */
app.get("/productos/:id", (req, res) => {
    try {
        const { id } = req.params;

        const producto = productosElectronicos.find((p) => p.id === id);
        if (!producto) throw new Error("Producto no encontrado.");

        return res.status(200).json(producto);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error al obtener los productos: ${error.message}`
        });
    }
});

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtiene todas las categorías de productos.
 *     responses:
 *       200:
 *         description: Categorías obtenidas correctamente.
 */
app.get("/categorias", (req, res) => {
    try {
        const categorias = [...new Set(productosElectronicos.map((p) => p.categoria))];
        if (!categorias) throw new Error("Categorias no encontradas.");

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error al obtener las categorías: ${error.message}`
        });
    }
});

app.use((req, res) => {
    return res.status(404)
        .send({ success: false, message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});