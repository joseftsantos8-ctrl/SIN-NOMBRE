// Catálogo de usuarios.
// - `role`     : clave INTERNA de routing (se usa en dashboard.js, herramientas.js, etc.).
// - `cargo`    : título OFICIAL según el doc de requerimientos (se muestra al usuario).
// - `area`     : área asignada (opcional, se muestra en tablas).
// - `password` : credencial demo.
export let users = {
    'ADMIN':      { name: 'Super Administrador',           role: 'Admin',                  cargo: 'Super Administrador',                                  area: '',                          password: '1234' },
    'F.CEBALLOS': { name: 'Francois Ceballos',             role: 'Gerente',                cargo: 'Líder de Tienda',                                      area: '',                          password: '1234' },
    'H.ACOSTA':   { name: 'Harold Acosta',                 role: 'Sugerente',              cargo: 'Sugerente',                                            area: '',                          password: '1234' },
    'F.ALVAREZ':  { name: 'Frain Alvarez',                 role: 'Líder Centro de Tienda', cargo: 'Líder JR Frescos',                                     area: 'Carnicería',                password: '1234' },
    'A.DEOLEO':   { name: 'Arisleydi De Oleo',             role: 'Líder Centro de Tienda', cargo: 'Líder JR Fresco y Centro Tienda',                      area: 'Centro Tienda + Frescos',   password: '1234' },
    'A.FISH':     { name: 'Angel Fish',                    role: 'Líder de Inventario',    cargo: 'Coordinador de Integridad de Góndola y Exhibiciones',  area: '',                          password: '1234' },
    'O.SUAREZ':   { name: 'Omar Suarez',                   role: 'Líder de Almacén',       cargo: 'Líder Recepción de Mercancía',                         area: 'Almacén / Vegetales',       password: '1234' },
    'J.AVILA':    { name: 'Javier Avila',                  role: 'Colaborador',            cargo: 'Gondolero',                                            area: '',                          password: '1234' },
    'E.CEDANO':   { name: 'Edison Cedano',                 role: 'Colaborador',            cargo: 'Gondolero',                                            area: '',                          password: '1234' },
    'A.CASTILLO': { name: 'Alexander Castillo',            role: 'Colaborador',            cargo: 'Gondolero',                                            area: '',                          password: '1234' },
    'L.FRESCOS':  { name: 'Luis Frescos',                  role: 'Líder de Frescos',       cargo: 'Líder de Frescos',                                     area: '',                          password: '1234' },
    'J.ARECHE':   { name: 'Jeneufry Areche de los Santos', role: 'POP',                    cargo: 'Señalización & Suministros',                           area: '',                          password: '1234' }
};
