const express = require("express")
const app = express()
const PORT = process.env.PORT || 3550
const productos = require("./productos.js")

// SWAGGER
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const { title } = require("process")
const { version } = require("os")

const swaggerSpec = swaggerJsdoc({
    swaggerDefinition: {
                        info: {
                            title: "API de ejemplo",
                            version: "1.0.0",
                            description: "Documentación de la <strong>API RESTFUL</strong> de ejemplo para <strong>Teclab</strong>.",
                        },
                        basePath: "/",
                        },
                        apis: ['index.js']
})

// Aquí definiremos los MiddleWares necesarios para nuestro BACKEND (http://127.0.0.1:3550/)1         1Red
app.use(express.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ENDPOINTS

/** 
 * @swagger
 * /:
 *  get:
 *      description: Obtiene la página de inicio/bienvenida
 *      responses:
 *          200:
 *              description: 'Bienvenida/o a la aplicación de backend'
*/
app.get("/", (req, res)=> {
    res.status(200).send("Bienvenid@s a la aplicación de backend.")
})

/**
 * @swagger
 * /productos:
 *  get:
 *      description: Obtiene el listado de productos
 *      responses:
 *          200:
 *              description: 'Listado de productos obtenido exitosamente.'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                      example: "1"
 *                                  nombre:
 *                                      type: string
 *                                      example: "Notebook i7"
 *                                  imagen:
 *                                      type: string
 *                                      example: "💻"
 *                                  precio:
 *                                      type: number
 *                                      example: 1200
 *                                  stock:
 *                                      type: integer
 *                                      example: 15
 *                                  categoria:
 *                                      type: string
 *                                      example: "Portátiles"
 *                      example:
 *                          - id: "1"
 *                            nombre: "Notebook i7"
 *                            imagen: "💻"
 *                            precio: 1200
 *                            stock: 15
 *                            categoria: "Portátiles"
 *                          - id: "2"
 *                            nombre: "Mouse Inalámbrico"
 *                            imagen: "🖱️"
 *                            precio: 25
 *                            stock: 50
 *                            categoria: "Accesorios"
 */
app.get("/productos", (req, res)=> {
    res.status(200).send(productos)
})

/** 
* @swagger
* /productos/{id}:
*   get:
*     summary: Obtener un producto por ID
*     description: Retorna un producto específico basado en su ID.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del producto que se desea obtener.
*     responses:
*       '200':
*         description: Producto encontrado
*         content:
*           application/json:
*             schema:
*       '404':
*         description: Producto no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/
app.get("/productos/:id", (req, res)=> {
    const id = req.params.id
    if (id.trim() === "") {
        res.redirect("/productos")
        return 
    }

    let resultado = productos.find((producto)=> producto.id === id)

    if (resultado !== undefined) {
        res.status(200).send(resultado)
    } else {
        res.status(404).send({ error: "No se ha encontrado un producto con el ID: " + id})
    }
})

/**
 * @swagger
 * /productos/categoria/{cat} :
    get:
      summary: Obtener productos por categoría
      description: Devuelve una lista de productos que pertenecen a una categoría específica.
      parameters:
        - name: cat
          in: path
          required: true
          description: Nombre de la categoría de productos.
          schema:
            type: string
      responses:
        '200':
          description: Lista de productos en la categoría especificada.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    nombre:
                      type: string
                      example: "Producto A"
                    categoria:
                      type: string
                      example: "Electrónica"
                    precio:
                      type: number
                      format: float
                      example: 99.99
        '302':
          description: Redirecciona a la lista de todos los productos si la categoría está vacía.
        '404':
          description: No se encontró ningún producto con la categoría especificada.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "No se ha encontrado producto(s) con la categoría: {cat}"
 */
app.get("/productos/categoria/:cat", (req, res)=> {
    const cat = req.params.cat
    if (cat.trim() === "") {
        res.redirect("/productos")
        return 
    }

    let resultado = productos.filter((producto)=> producto.categoria === cat)

    if (resultado.length > 0) {
        res.status(200).send(resultado)
    } else {
        res.status(404).send({ error: "No se ha encontrado producto(s) con la categoría: " + cat})
    }
})

app.get("*", (req, res)=> {
    res.status(404).send({error: "⛔️ La ruta solicitada no existe."})
})

console.clear()
app.listen(PORT, ()=> console.log("✅ Aplicación iniciada en el puerto:", PORT))