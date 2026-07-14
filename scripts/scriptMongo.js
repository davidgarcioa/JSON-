var conexion = new Mongo("mongodb://127.0.0.1:27017");
var db = conexion.getDB("tienda_sena");

print("Conexion exitosa");
print("Poblando base de datos tienda_sena");

db.usuarios.drop();
db.productos.drop();
db.categorias.drop();
db.pedidos.drop();

db.usuarios.insertMany([
  {
    nombre: "Chris",
    apellido: "Gomez",
    email: "chris@sena.edu.co",
    password: "123456",
    rol: "cliente",
    telefono: "3001112233",
    activo: true,
    perfil: {
      ciudad: "Bogota",
      direccionPrincipal: "Calle 10 # 20-30"
    },
    direcciones: [
      {
        tipo: "casa",
        ciudad: "Bogota",
        direccion: "Calle 10 # 20-30",
        principal: true
      }
    ],
    creadoEn: new Date("2026-07-01")
  },
  {
    nombre: "Laura",
    apellido: "Perez",
    email: "laura@sena.edu.co",
    password: "abc123",
    rol: "cliente",
    telefono: "3012223344",
    activo: true,
    perfil: {
      ciudad: "Medellin",
      direccionPrincipal: "Carrera 45 # 12-18"
    },
    direcciones: [],
    creadoEn: new Date("2026-07-02")
  }
]);

db.categorias.insertMany([
  {
    nombre: "Tecnologia",
    descripcion: "Productos electronicos y accesorios"
  },
  {
    nombre: "Papeleria",
    descripcion: "Utiles escolares y de oficina"
  },
  {
    nombre: "Hogar",
    descripcion: "Articulos para el hogar"
  }
]);

db.productos.insertMany([
  {
    nombre: "Mouse inalambrico",
    categoria: "Tecnologia",
    precio: 45000,
    stock: 8,
    activo: true,
    proveedor: {
      nombre: "TecnoProveedor",
      nit: "900111222-1"
    },
    comentarios: [
      {
        usuarioEmail: "laura@sena.edu.co",
        calificacion: 5,
        texto: "Muy comodo",
        fecha: new Date("2026-07-03")
      }
    ]
  },
  {
    nombre: "Teclado mecanico",
    categoria: "Tecnologia",
    precio: 135000,
    stock: 5,
    activo: true,
    proveedor: {
      nombre: "TecnoProveedor",
      nit: "900111222-1"
    },
    comentarios: []
  },
  {
    nombre: "Cuaderno argollado",
    categoria: "Papeleria",
    precio: 12000,
    stock: 25,
    activo: true,
    proveedor: {
      nombre: "Papeles del Sur",
      nit: "901333444-2"
    },
    comentarios: []
  },
  {
    nombre: "Lampara led",
    categoria: "Hogar",
    precio: 58000,
    stock: 3,
    activo: true,
    proveedor: {
      nombre: "Casa Luz",
      nit: "902555666-3"
    },
    comentarios: []
  }
]);

db.pedidos.insertMany([
  {
    usuarioEmail: "chris@sena.edu.co",
    estado: "pagado",
    fecha: new Date("2026-07-04"),
    productos: [
      {
        nombre: "Mouse inalambrico",
        cantidad: 1,
        precioUnitario: 45000
      },
      {
        nombre: "Cuaderno argollado",
        cantidad: 2,
        precioUnitario: 12000
      }
    ],
    total: 69000
  },
  {
    usuarioEmail: "laura@sena.edu.co",
    estado: "pendiente",
    fecha: new Date("2026-07-05"),
    productos: [
      {
        nombre: "Teclado mecanico",
        cantidad: 1,
        precioUnitario: 135000
      }
    ],
    total: 135000
  }
]);

print("Datos iniciales insertados");
print("======================================");

var emailLogin = "chris@sena.edu.co";
var passwordLogin = "123456";

print("Consulta 1 - Login por email");
var usuarioLogueado = db.usuarios.findOne({
  email: emailLogin,
  password: passwordLogin,
  activo: true
});

if (usuarioLogueado == null) {
  print("El usuario no existe o la clave es incorrecta. No se ejecutan mas consultas.");
} else {
  print("Acceso permitido para: " + usuarioLogueado.nombre);

  print("Consulta 2 - Listar productos con stock menor a 10");
  db.productos.find({ stock: { $lt: 10 } }).forEach(printjson);

  print("Consulta 3 - Actualizar el perfil de un usuario");
  db.usuarios.updateOne(
    { email: emailLogin },
    {
      $set: {
        telefono: "3009998877",
        "perfil.ciudad": "Cali",
        "perfil.direccionPrincipal": "Avenida 5 # 15-40"
      }
    }
  );
  printjson(db.usuarios.findOne({ email: emailLogin }, { password: 0 }));

  print("Consulta 4 - Insertar una nueva anidacion en direcciones del usuario");
  db.usuarios.updateOne(
    { email: emailLogin },
    {
      $push: {
        direcciones: {
          tipo: "trabajo",
          ciudad: "Cali",
          direccion: "Avenida 5 # 15-40",
          principal: false
        }
      }
    }
  );
  printjson(db.usuarios.findOne({ email: emailLogin }, { password: 0 }));

  print("Consulta 5 - Buscar productos activos por categoria");
  db.productos.find({
    categoria: "Tecnologia",
    activo: true
  }).forEach(printjson);

  print("Consulta 6 - Listar pedidos del usuario logueado");
  db.pedidos.find({ usuarioEmail: emailLogin }).forEach(printjson);

  print("Consulta 7 - Consultar pedidos con total mayor o igual a 100000");
  db.pedidos.find({ total: { $gte: 100000 } }).forEach(printjson);

  print("Consulta 8 - Insertar un nuevo pedido con productos anidados");
  db.pedidos.insertOne({
    usuarioEmail: emailLogin,
    estado: "pendiente",
    fecha: new Date(),
    productos: [
      {
        nombre: "Lampara led",
        cantidad: 1,
        precioUnitario: 58000
      }
    ],
    total: 58000
  });
  db.pedidos.find({ usuarioEmail: emailLogin }).forEach(printjson);

  print("Consulta 9 - Agregar comentario anidado a un producto");
  db.productos.updateOne(
    { nombre: "Teclado mecanico" },
    {
      $push: {
        comentarios: {
          usuarioEmail: emailLogin,
          calificacion: 4,
          texto: "Buen producto para estudiar y programar",
          fecha: new Date()
        }
      }
    }
  );
  printjson(db.productos.findOne({ nombre: "Teclado mecanico" }));

  print("Consulta 10 - Disminuir stock despues de una compra");
  db.productos.updateOne(
    { nombre: "Lampara led", stock: { $gte: 1 } },
    { $inc: { stock: -1 } }
  );
  printjson(db.productos.findOne({ nombre: "Lampara led" }));

  print("Consulta 11 - Listar productos ordenados por precio de mayor a menor");
  db.productos.find({ activo: true }).sort({ precio: -1 }).forEach(printjson);

  print("Consulta 12 - Resumen de ventas por usuario");
  db.pedidos.aggregate([
    {
      $group: {
        _id: "$usuarioEmail",
        cantidadPedidos: { $sum: 1 },
        totalComprado: { $sum: "$total" }
      }
    },
    {
      $sort: {
        totalComprado: -1
      }
    }
  ]).forEach(printjson);
}
