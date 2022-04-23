const modules = [
    {
        _id: "1",
        name: "Bitacora de Ejecución",
        surname: "bitacora",
        view: ["admin","user"]
    },
    {
        _id: "2",
        name: "Venta Diaria",
        surname: "venta_diaria",
        view: ["admin","user"]
    },
    {
        _id: "3",
        name: "Métodos de Pago",
        surname: "payment_methods",
        view: ["admin"]
    },
    {
        _id: "4",
        name: "Tickets",
        surname: "tickets",
        view: ["admin","user"]
    },
    {
        _id: "5",
        name: "Mercadería Dañada",
        surname: "mercaderia",
        view: ["admin","user"]
    },
    {
        _id: "6",
        name: "Certificados",
        surname: "certificados",
        view: ["admin","user"],
    },
    {
        _id: "7",
        name: "Retiros",
        surname: "retiros",
        view: ["admin"]
    },
    {
        _id: "8",
        name: "Colaboradores",
        surname: "colaboradores",
        view: ["admin"]
    },
    {
        _id: "9",
        name: "Usuarios",
        surname: "usuarios",
        view: ["admin"]
    },
]

exports.modules = modules;