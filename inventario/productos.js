export const products = [
    { id: '1001', ean: '8806090123456', desc: 'TV Samsung 55" 4K',    cat: 'Electrónica',      stock: 45  },
    { id: '1002', ean: '7460001001234', desc: 'Leche Entera Rica 1L', cat: 'Lácteos',          stock: 120 },
    { id: '1003', ean: '7500435123456', desc: 'Detergente Ariel 2KG', cat: 'Limpieza',         stock: 15  },
    { id: '1004', ean: '7460002005487', desc: 'Arroz Bisonó 10lb',    cat: 'Abarrotes',        stock: 85  },
    { id: '1005', ean: '0120000001334', desc: 'Coca-Cola 2L',         cat: 'Bebidas',          stock: 200 },
    { id: '1006', ean: '7460005001245', desc: 'Pollo Fresco Entero',  cat: 'Carnes',           stock: 30  },
    { id: '1007', ean: '8410111002356', desc: 'Aceite Crisol 1 Gal',  cat: 'Abarrotes',        stock: 60  },
    { id: '1008', ean: '7460008001254', desc: 'Papel Higiénico 4ud',  cat: 'Limpieza',         stock: 150 },
    { id: '1009', ean: '1111111111111', desc: 'Jabón Protex',         cat: 'Cuidado Personal', stock: 50  },
    { id: '1010', ean: '2222222222222', desc: 'Galletas Oreo 36g',    cat: 'Snacks',           stock: 80  }
];

for (let i = 1; i <= 20000; i++) {
    products.push({
        id: (2000 + i).toString(),
        ean: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        desc: `Artículo Auto-Generado ${i}`,
        cat: 'General',
        stock: Math.floor(Math.random() * 500)
    });
}
