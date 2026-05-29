INSERT INTO usuarios (nombre, apellidos, email, password, telefono, activo, fecha_nacimiento, eventos_asistidos, rol, saldo_cuenta) VALUES
('Lucia', 'Perez Gomez', 'lucia@gmail.com', 'cliente', '600111111', true, '1998-05-12', 5, 'CLIENTE', 50),
('Mario', 'Lopez Ruiz', 'mario@gmail.com', 'cliente', '600222222', true, '1995-03-20', 2, 'CLIENTE', 30),
('Ana', 'Garcia Torres', 'ana@gmail.com', '$2a$10$ZJiTArRa9PFZkLQrXP/0T.dJdtBBKa6bsMRGg4Fx6IqmTHcOkXRba', '600333333', true, '1992-07-15', 10, 'ADMIN', 100),
('Carlos', 'Sanchez Diaz', 'carlos@gmail.com', 'organiz', '600444444', true, '1990-01-10', 7, 'ORGANIZADOR', 200),
('Laura', 'Martin Vega', 'laura@gmail.com', 'cliente', '600555555', true, '1999-11-25', 1, 'CLIENTE', 20),
('David', 'Fernandez Cruz', 'david@gmail.com', 'organiz', '600666666', true, '1993-09-08', 4, 'ORGANIZADOR', 150),
('Sara', 'Navarro Gil', 'sara@gmail.com', 'cliente', '600777777', true, '1997-04-18', 6, 'CLIENTE', 60),
('Javier', 'Romero Cano', 'javier@gmail.com', 'cliente', '600888888', true, '1991-12-30', 3, 'CLIENTE', 40),
('Elena', 'Moreno Ortiz', 'elena@gmail.com', 'organiz', '600999999', true, '1996-06-06', 8, 'ORGANIZADOR', 180),
('Pablo', 'Hernandez Soto', 'pablo@gmail.com', 'cliente', '600000000', true, '1989-02-14', 9, 'CLIENTE', 70);

INSERT INTO artistas (nombre_artistico, nombre_real, genero_musical, fecha_nacimiento, activo, cache, eventos_realizados) VALUES
('Aitana', 'Aitana Ocaña Morales', 'Pop', '1999-06-27', true, 8000, 120),
('Lola Indigo', 'Miriam Doblas Muñoz', 'Pop', '1992-04-01', true, 7500, 110),
('Quevedo', 'Pedro Domínguez Quevedo', 'Trap', '2001-12-07', true, 9000, 95),
('Kase.O', 'Javier Ibarra Ramos', 'Rap', '1980-03-01', true, 10000, 200),
('Rapsusklei', 'Diego Gil Fernández', 'Rap', '1980-07-18', true, 7000, 180),
('Lia Kali', 'Lía Kali', 'Rap', '1997-01-01', true, 6500, 60),
('Dani DPM', 'Daniel Pérez Martínez', 'Rap', '1995-05-10', true, 6000, 50),
('Miss K8', 'Kateryna Kremko', 'Hardstyle', '1994-01-01', true, 8500, 140),
('Angerfist', 'Danny Masseling', 'Hardstyle', '1981-06-20', true, 9500, 220),
('Bad Gyal', 'Alba Farelo', 'Trap', '1997-03-07', true, 8200, 100);

INSERT INTO recintos (nombre, direccion, ciudad, capacidad, cubierto, precio_alquiler, eventos_celebrados, fecha_inauguracion) VALUES
('WiZink Center', 'Av. de Felipe II, s/n', 'Madrid', 15000, true, 5000, 300, '2005-01-01'),
('Palau Sant Jordi', 'Passeig Olímpic, 5-7', 'Barcelona', 17000, true, 5500, 280, '1990-09-21'),
('Ciudad de las Artes Stage', 'Av. del Professor López Piñero, 7', 'Valencia', 12000, false, 4500, 150, '2003-04-16'),
('Cartuja Center', 'Calle Leonardo da Vinci, 7', 'Sevilla', 3500, true, 2000, 120, '2018-03-15'),
('Bilbao Arena', 'Askatasuna Etorbidea, 13', 'Bilbao', 10000, true, 4000, 180, '2010-01-09'),
('Pabellón Príncipe Felipe', 'Av. de Cesáreo Alierta, 120', 'Zaragoza', 10000, true, 3000, 200, '1990-01-01'),
('Auditorio Cortijo de Torres', 'Cortijo de Torres, s/n', 'Málaga', 14000, false, 4200, 160, '2000-06-10'),
('Palacio de Deportes Granada', 'Paseo del Emperador Carlos V, 16', 'Granada', 11000, true, 3800, 140, '1991-01-01'),
('Plaza de Toros Alicante', 'Plaza de España, 7', 'Alicante', 9000, false, 2500, 130, '1888-01-01'),
('Cuartel de Artillería', 'Calle Cartagena, s/n', 'Murcia', 5000, false, 2200, 90, '1921-01-01');

INSERT INTO eventos (nombre, descripcion, fecha_evento, hora_evento, precio_entrada, aforo_maximo, entradas_disponibles, cancelado, presencial, categoria, usuario_id, artista_id, recinto_id) VALUES
('Madrid Urban Fest', 'Festival de musica urbana con artistas top', '2026-07-15', '22:00', 45, 15000, 12000, false, true, 'FESTIVAL', 4, 3, 1),
('Barcelona Pop Experience', 'Concierto pop en gran formato', '2026-06-20', '21:30', 50, 17000, 14000, false, true, 'CONCIERTO', 6, 1, 2),
('Valencia Summer Beats', 'Festival electronico al aire libre', '2026-08-05', '23:00', 40, 12000, 10000, false, true, 'FESTIVAL', 4, 8, 3),
('Sevilla Flow Night', 'Evento de rap y trap en directo', '2026-05-18', '22:30', 30, 3500, 2500, false, true, 'CONCIERTO', 6, 4, 4),
('Bilbao Rap Legends', 'Concierto de rap clasico', '2026-04-10', '20:30', 35, 10000, 8000, false, true, 'CONCIERTO', 9, 5, 5),
('Zaragoza Hardstyle Night', 'Sesion hardstyle con DJs internacionales', '2026-09-12', '23:59', 38, 10000, 9000, false, true, 'FIESTA', 4, 9, 6),
('Malaga Beach Festival', 'Festival veraniego con artistas urbanos', '2026-07-30', '21:00', 55, 14000, 12000, false, true, 'FESTIVAL', 6, 2, 7),
('Granada Indie Pop Live', 'Concierto de pop alternativo', '2026-03-22', '20:00', 25, 11000, 9000, false, true, 'CONCIERTO', 9, 7, 8),
('Alicante Urban Party', 'Evento urbano con DJ y artistas emergentes', '2026-10-10', '22:00', 28, 9000, 7000, false, true, 'FIESTA', 4, 10, 9),
('Murcia Online Music Fest', 'Festival online con streaming en directo', '2026-11-18', '19:00', 10, 5000, 5000, false, false, 'ONLINE', 6, 6, 10);

INSERT INTO reservas (fecha_reserva, cantidad_entradas, precio_total, metodo_pago, codigo_reserva, confirmada, usuario_id, evento_id) VALUES
('2026-01-01', 2, 90, 'TARJETA', 'RES001', true, 1, 1),
('2026-01-02', 1, 50, 'PAYPAL', 'RES002', true, 2, 2),
('2026-01-03', 3, 120, 'TARJETA', 'RES003', false, 5, 3),
('2026-01-04', 2, 60, 'EFECTIVO', 'RES004', true, 7, 4),
('2026-01-05', 1, 35, 'TARJETA', 'RES005', true, 8, 5),
('2026-01-06', 4, 152, 'PAYPAL', 'RES006', false, 10, 6),
('2026-01-07', 2, 110, 'TARJETA', 'RES007', true, 3, 7),
('2026-01-08', 1, 25, 'PAYPAL', 'RES008', true, 6, 8),
('2026-01-09', 2, 56, 'EFECTIVO', 'RES009', false, 4, 9),
('2026-01-10', 1, 10, 'TARJETA', 'RES010', true, 9, 10);