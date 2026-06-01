SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE entradas;
TRUNCATE TABLE reservas;
TRUNCATE TABLE eventos_artistas;
TRUNCATE TABLE eventos;
TRUNCATE TABLE artistas;
TRUNCATE TABLE recintos;
TRUNCATE TABLE usuarios;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `usuarios` (nombre, apellidos, email, password, telefono, fecha_nacimiento, rol, activo, fecha_registro) VALUES
-- Administradores
('Carlos',    'Martínez López',    'carlos.admin@eventia.com',    '$2a$12$9GEoWY5/JfEQbPwjVS1F7.bZW7FclI3LJrEny4Y6p/mQrXGlie8s2',  '611000001', '1985-03-12', 'ADMIN',        true,  '2024-01-10 09:00:00'),
('Lucía',     'Felipe Ruiz',       'lucia.admin@eventia.com',     '$2a$12$9GEoWY5/JfEQbPwjVS1F7.bZW7FclI3LJrEny4Y6p/mQrXGlie8s2',  '611000002', '1999-04-27', 'ADMIN',        true,  '2024-01-10 09:05:00'),
('Miguel',    'Fernández Torres',  'miguel.admin@eventia.com',    '$2a$12$9GEoWY5/JfEQbPwjVS1F7.bZW7FclI3LJrEny4Y6p/mQrXGlie8s2',  '611000003', '1990-11-05', 'ADMIN',        true,  '2024-01-10 09:10:00'),

-- Organizadores
('Diego',     'Navarro Pérez',     'diego.org@eventia.com',       '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000001', '1987-04-18', 'ORGANIZADOR',  true,  '2024-02-01 10:00:00'),
('Sofía',     'Herrera Blanco',    'sofia.org@eventia.com',       '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000002', '1992-09-30', 'ORGANIZADOR',  true,  '2024-02-01 10:10:00'),
('Alejandro', 'Ramos Castro',      'alex.org@eventia.com',        '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000003', '1983-12-01', 'ORGANIZADOR',  true,  '2024-02-01 10:20:00'),
('Elena',     'Díaz Moreno',       'elena.org@eventia.com',       '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000004', '1989-06-15', 'ORGANIZADOR',  true,  '2024-02-15 11:00:00'),
('Pablo',     'Jiménez Ortega',    'pablo.org@eventia.com',       '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000005', '1991-02-28', 'ORGANIZADOR',  true,  '2024-02-15 11:10:00'),
('Cristina',  'López Sánchez',     'cristina.org@eventia.com',    '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000006', '1986-08-20', 'ORGANIZADOR',  true,  '2024-03-01 09:00:00'),
('Iván',      'Morales Vega',      'ivan.org@eventia.com',        '$2a$12$LFn/dGh33SRzhPOQyPW2Y.oxDjDG9t8Uo0y924rt/szn9mgCOmI/S',   '622000007', '1993-05-10', 'ORGANIZADOR',  true,  '2024-03-01 09:30:00'),

-- Usuarios
('Ana',       'García Pérez',      'ana.garcia@email.com',        '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000001', '1998-03-22', 'USUARIO',      true,  '2024-03-10 12:00:00'),
('Luis',      'Martínez Gil',      'luis.martinez@email.com',     '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000002', '1995-11-14', 'USUARIO',      true,  '2024-03-11 14:30:00'),
('María',     'López Ruiz',        'maria.lopez@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000003', '2000-06-08', 'USUARIO',      true,  '2024-03-12 16:00:00'),
('Javier',    'Sánchez Mora',      'javier.sanchez@email.com',    '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000004', '1997-09-25', 'USUARIO',      true,  '2024-03-13 10:00:00'),
('Patricia',  'Romero Torres',     'patricia.romero@email.com',   '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000005', '1999-01-17', 'USUARIO',      true,  '2024-03-14 11:00:00'),
('David',     'Alonso Fuentes',    'david.alonso@email.com',      '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000006', '1996-07-03', 'USUARIO',      true,  '2024-03-15 09:00:00'),
('Sara',      'Castro Nieto',      'sara.castro@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000007', '2001-04-19', 'USUARIO',      true,  '2024-04-01 10:00:00'),
('Carlos',    'Vega Iglesias',     'carlos.vega@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000008', '1994-12-30', 'USUARIO',      true,  '2024-04-02 10:30:00'),
('Lucía',     'Blanco Cortés',     'lucia.blanco@email.com',      '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000009', '2002-02-14', 'USUARIO',      true,  '2024-04-03 11:00:00'),
('Rubén',     'Jiménez Campos',    'ruben.jimenez@email.com',     '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000010', '1993-08-07', 'USUARIO',      true,  '2024-04-04 13:00:00'),
('Nuria',     'Ortiz Delgado',     'nuria.ortiz@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000011', '1998-10-21', 'USUARIO',      true,  '2024-04-05 15:00:00'),
('Adrián',    'Molina Herrero',    'adrian.molina@email.com',     '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000012', '1997-05-16', 'USUARIO',      true,  '2024-04-06 09:00:00'),
('Marta',     'Serrano Reyes',     'marta.serrano@email.com',     '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000013', '2000-11-02', 'USUARIO',      true,  '2024-04-07 10:00:00'),
('Hugo',      'Flores Medina',     'hugo.flores@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000014', '1995-03-28', 'USUARIO',      true,  '2024-04-08 12:00:00'),
('Irene',     'Santos Gallego',    'irene.santos@email.com',      '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000015', '1999-07-11', 'USUARIO',      true,  '2024-04-09 14:00:00'),
('Alejandro', 'Cruz Navarro',      'alejandro.cruz@email.com',    '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000016', '1996-09-05', 'USUARIO',      true,  '2024-04-10 16:00:00'),
('Claudia',   'Guerrero Lozano',   'claudia.guerrero@email.com',  '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000017', '2012-01-23', 'USUARIO',      true,  '2024-04-11 10:00:00'),
('Sergio',    'Prieto Cano',       'sergio.prieto@email.com',     '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000018', '1993-06-17', 'USUARIO',      true,  '2024-04-12 11:00:00'),
('Beatriz',   'Vargas Ibáñez',     'beatriz.vargas@email.com',    '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000019', '2000-08-29', 'USUARIO',      true,  '2024-04-13 13:00:00'),
('Óscar',     'Muñoz Arroyo',      'oscar.munoz@email.com',       '$2a$12$.GjtXGvvPlWbRZx.mTUnReJunl.I39d3D6dcQlLPXZ.ZVN4Sl9Xpu',   '633000020', '1997-12-04', 'USUARIO',      false, '2024-04-14 09:00:00');



INSERT INTO `recintos` (nombre, direccion, ciudad, provincia, aforo, descripcion, imagen_url, latitud, longitud, google_place_id) VALUES
-- Techno / Hardcore
('Fabrik', 'Av. de la Industria, 82', 'Humanes de Madrid', 'Madrid', 10000, 'Templo de la electrónica con una enorme pista principal, terrazas y satélites. Sede de las famosas fiestas Code y Masters of Hardcore.', NULL, 40.248389, -3.840417, NULL),
('Desierto de los Monegros (Recinto MDF)', 'Carretera N-II, km 417', 'Fraga', 'Huesca', 50000, 'Macro festival al aire libre en mitad del desierto de Los Monegros. Referente mundial de Techno, Hard-Techno y Drum and Bass.', NULL, 41.481100, 0.165200, NULL),
('Razzmatazz', 'Carrer dels Almogàvers, 122', 'Barcelona', 'Barcelona', 3200, 'Sala emblemática de Barcelona con cinco espacios musicales independientes que abarcan indie, pop, rap y techno en su sala Loft.', NULL, 41.397750, 2.191111, NULL),
('Parc del Fòrum', 'Plaça de Leonardo da Vinci, 4', 'Barcelona', 'Barcelona', 65000, 'Macrorecinto frente al mar. Sede de grandes festivales como el Primavera Sound, Cruïlla y eventos masivos de techno y reggaetón.', NULL, 41.411111, 2.222778, NULL),
('Hï Ibiza', 'Ctra. de Platja d''en Bossa, s/n', 'Sant Josep de sa Talaia', 'Islas Baleares', 5500, 'Elegido mejor club del mundo. Epicentro mundial de la música electrónica y el techno de vanguardia.', NULL, 38.884722, 1.404167, NULL),
('Pacha Ibiza', 'Avinguda 8 d''Agost, 18', 'Eivissa', 'Islas Baleares', 3000, 'Discoteca icónica fundada en 1973, famosa mundialmente por sus cerezas, su ambiente de lujo y sus sesiones de House y Techno.', NULL, 38.918600, 1.442800, NULL),
('Fira Barcelona Gran Via (Sónar de Noche)', 'Av. Joan Carles I, 64', 'L''Hospitalet de Llobregat', 'Barcelona', 25000, 'Recinto ferial que alberga las ediciones nocturnas del Festival Sónar de música avanzada, techno y arte digital.', NULL, 41.353400, 2.128700, NULL),
('Coliseum', 'Carretera de Tarragona, km 12', 'Almudévar', 'Huesca', 2500, 'Considerada la catedral de la música electrónica, el remember y el sonido Hardcore / Makina en todo Aragón.', NULL, 42.040100, -0.575600, NULL),
('Spook Multiespacio', 'Carretera del Río, 399', 'Pinedo', 'Valencia', 4000, 'Mítica discoteca de la ruta totalmente renovada, actual bastión del hard-techno e industrial en la costa levantina.', NULL, 39.401111, -0.334722, NULL),

-- Reggaetón / Urbano
('Ciudad Deportiva Guillermo Amor (RBF Benidorm)', 'Av. Ciudad Deportiva, s/n', 'Benidorm', 'Alicante', 30000, 'Estadio y macrorecinto al aire libre que acoge el Reggaeton Beach Festival de Benidorm, el evento urbano más masivo de la zona.', NULL, 38.544400, -0.141900, NULL),
('Marina de Valencia (Cali Rumba Eventos)', 'Carrer de la Marina, s/n', 'Valencia', 'Valencia', 15000, 'Espacio marítimo y urbano utilizado para conciertos de reggaetón, trap y festivales veraniegos frente al puerto.', NULL, 39.459900, -0.311800, NULL),
('IFEMA Madrid (Recinto Ferial)', 'Avenida del Partenón, 5', 'Madrid', 'Madrid', 35000, 'Los pabellones y áreas exteriores albergan el Madrid Salvaje y los mayores festivales de rap, trap y reggaetón de la capital.', NULL, 40.467500, -3.617500, NULL),
('Teatro Barceló', 'Calle de Barceló, 11', 'Madrid', 'Madrid', 1200, 'Histórico teatro reconvertido en club exclusivo de varias plantas. Sesiones comerciales, pop y música urbana de referencia.', NULL, 40.427700, -3.699700, NULL),
('Sala But (La Paqui)', 'Calle de Barceló, 13', 'Madrid', 'Madrid', 1000, 'Sala de conciertos polivalente en el centro de Madrid, famosa por sus directos de rap y noches de clubbing urbano.', NULL, 40.427900, -3.699400, NULL),

-- Pop / Grandes recintos
('Palacio Vistalegre', 'Calle de Utebo, 1', 'Madrid', 'Madrid', 14000, 'Arena multiusos cubierta en el distrito de Carabanchel. Sede de conciertos de pop, rap de gran formato y eventos de esports.', NULL, 40.386100, -3.738800, NULL),
('WiZink Center', 'Avenida de Felipe II, s/n', 'Madrid', 'Madrid', 17453, 'El pabellón multiusos más activo de España. Acoge las giras internacionales más importantes de pop, reggaetón y rap.', NULL, 40.423972, -3.671611, NULL),
('Palau Sant Jordi', 'Passeig Olímpic, 5-7', 'Barcelona', 'Barcelona', 17960, 'Recinto icónico de la anilla olímpica de Montjuïc, diseñado por Arata Isozaki. Sede clave para el pop de estadio en Barcelona.', NULL, 41.363800, 2.152600, NULL),
('Estadio Santiago Bernabéu', 'Avenida de Concha Espina, 1', 'Madrid', 'Madrid', 75000, 'Estadio del Real Madrid CF, equipado con cubierta y césped retráctil para acoger macroconciertos internacionales de pop mundial.', NULL, 40.453056, -3.688333, NULL),
('Estadio Olímpico Lluís Companys', 'Passeig Olímpic, 15-17', 'Barcelona', 'Barcelona', 55000, 'Estadio histórico de Montjuïc utilizado para las giras de estadios más masivas del pop y rock internacional.', NULL, 41.364700, 2.155600, NULL),

-- Rap / Hip-Hop
('La Riviera', 'Paseo bajo de la Virgen del Puerto, s/n', 'Madrid', 'Madrid', 2500, 'Mítica sala a orillas del Manzanares. Es el termómetro de las bandas de pop y los mayores directos de rap nacional.', NULL, 40.413500, -3.724600, NULL),
('Sala Apolo', 'Carrer Nou de la Rambla, 113', 'Barcelona', 'Barcelona', 1600, 'Club histórico europeo. Alberga directos de rap underground y las famosas sesiones de clubbing electrónico Nitsa.', NULL, 41.374400, 2.169400, NULL),
('Recinto Iberdrola Music (Mad Cool)', 'Calle Laguna Dalga, s/n', 'Madrid', 'Madrid', 85000, 'Espacio de festivales masivos al aire libre en el distrito de Villaverde, sede actual del festival multidisciplinar Mad Cool.', NULL, 40.334200, -3.702500, NULL),
('Kobetamendi (Bilbao BBK Live)', 'Monte Kobetas, s/n', 'Bilbao', 'Bizkaia', 40000, 'Parque natural de montaña que se transforma en el recinto del Bilbao BBK Live, combinando pop, rock y música urbana.', NULL, 43.259400, -2.964200, NULL),
('Multiespacio Rabasa (Área 12)', 'Carrer de Xàtiva, s/n', 'Alicante', 'Alicante', 15000, 'Gran recinto ferial al aire libre referente de la Costa Blanca. Acoge giras de música urbana, rap y festivales de verano.', NULL, 38.368840, -0.499420, NULL),
('Camping Municipal de Zaragoza (Recinto Lagata)', 'Calle de San Juan Bautista de la Salle, s/n', 'Zaragoza', 'Zaragoza', 3000, 'Sede oficial del Lagata Reggae Festival. Alberga conciertos de reggae, rap, dancehall y zonas de acampada cultural.', NULL, 41.632420, -0.923180, NULL),

-- Clubs adicionales
('Recinto Medusa Festival', 'Playa de Cullera, s/n', 'Cullera', 'Valencia', 60000, 'Macroespacio en la playa. Sede del Medusa Sunbeach, el festival más grande de España de techno, hardcore y música remember.', NULL, 39.155556, -0.241667, NULL),
('Industrial Copera', 'Calle Desmond Tutu, Parcela 13', 'La Zubia', 'Granada', 1200, 'Sala de conciertos referente en el sur de España, famosa por su acústica impecable y sus sesiones de techno y drum & bass.', NULL, 37.136111, -3.601389, NULL),
('INPUT High Fidelity Dance Club', 'Av. de Francesc Ferrer i Guàrdia, 13', 'Barcelona', 'Barcelona', 1000, 'Ubicado en el Poble Espanyol. Es el club de techno puro por excelencia en Barcelona con sonido Funktion-One de alta fidelidad.', NULL, 41.368889, -2.148611, NULL),
('Central Rock', 'Avenida de Elche, 20', 'Almoradí', 'Alicante', 2000, 'Mítico templo levantino de la música hardcore, makina y sonidos duros que sigue abriendo en fechas señaladas.', NULL, 38.061200, -0.784400, NULL),
('Espacio Zity (Recinto Ferial de Valdespartera)', 'Avenida de Casablanca, s/n', 'Zaragoza', 'Zaragoza', 25000, 'Macrorecinto ferial al aire libre y bajo carpas que alberga las principales actuaciones musicales, festivales de pop, rock, reggaetón y techno durante las Fiestas del Pilar.', NULL, 41.611132, -0.923845, NULL),
('Sala Oasis', 'Calle de San Vicente de Paúl, 28', 'Zaragoza', 'Zaragoza', 900, 'Histórica sala de conciertos en el centro de la ciudad con estética de teatro clásico. Alberga conciertos de pop, rap, indie y sesiones nocturnas de música electrónica y urbana.', NULL, 41.652194, -0.876778, NULL),
('Sala López', 'Calle de Sixto Celorrio, 2', 'Zaragoza', 'Zaragoza', 350, 'Mítica sala a orillas del río Ebro conocida por su programación de música alternativa, conciertos de rock, rap, indie y sesiones de DJs de electrónica y drum and bass.', NULL, 41.657780, -0.875280, NULL);



INSERT INTO `artistas` (nombre_artistico, nombre_real, genero_musical, descripcion, fecha_nacimiento, imagen_url, instagram, spotify, activo, cache, eventos_realizados) VALUES
-- Hardcore / Hardstyle / Techno
('Miss K8', 'Kateryna Kremko', 'Hardcore', 'DJ y productora ucraniana conocida internacionalmente como la reina del Hardcore, habitual en el festival Masters of Hardcore.', '1981-06-18', NULL, 'https://instagram.com/missk8', 'https://open.spotify.com/artist/539Arv8I0nSca68S2ntn3G', 1, 15000, 320),
('Angerfist', 'Danny Masseling', 'Hardcore', 'Productor y DJ de Hardcore y Gabber holandés, famoso por actuar siempre cubierto con una máscara de hockey blanca.', '1981-06-20', NULL, 'https://instagram.com/angerfist_official', 'https://open.spotify.com/artist/4X96O4AL397GCHvI8S709I', 1, 20000, 510),
('Sefa', 'Sefa Jeroen Vlaarkamp', 'Frenchcore', 'DJ y productor holandés que revolucionó el estilo Frenchcore integrando elementos de música clásica al piano.', '2000-06-30', NULL, 'https://instagram.com/sefanl', 'https://open.spotify.com/artist/1G1nNWeuJ2vKzX7987Gfba', 1, 12000, 180),
('Dany BPM', 'Daniel Bañón Martínez', 'Jumpstyle', 'DJ y productor español referente nacional del sonido Jumpstyle, Hard Dance y Tek, muy presente en salas del este del país.', '1984-12-05', NULL, 'https://instagram.com/danybpm', 'https://open.spotify.com/artist/3jG5X6WzZfA1k8V2pLwM1g', 1, 3500, 240),
('Amelie Lens', 'Amelie Lens', 'Techno', 'DJ, productora y dueña de sello belga, conocida por sus intensos sets de techno ácido e industrial y sus residencias mundiales.', '1990-05-31', NULL, 'https://instagram.com/amelie_lens', 'https://open.spotify.com/artist/3S8yq8YfR1TIsG3V7Mbe7W', 1, 35000, 450),
('Da Tweekaz', 'Kenth Kvien y Marcus Nordli', 'Hardstyle', 'Dúo noruego de Euphoric Hardstyle afincado en Bélgica, conocidos por su energía festiva y remixes de bandas sonoras.', NULL, NULL, 'https://instagram.com/datweekaz', 'https://open.spotify.com/artist/20gDeK2WofK9OqW8v6z87g', 1, 18000, 400),
('Dr. Peacock', 'Steve Dekker', 'Frenchcore', 'DJ holandés considerado uno de los padres y principales divulgadores del Frenchcore internacional con su sello Peacock Records.', '1988-08-01', NULL, 'https://instagram.com/dr_peacock', 'https://open.spotify.com/artist/1O0K61K0A78zQ2X9U8BfBa', 1, 14000, 290),
('DJ Marta', 'Marta Madrid Forcen', 'Hard Dance', 'Icónica DJ española de música remember y Hard Dance, residente mítica de la histórica sala Radical.', '1977-10-24', NULL, 'https://instagram.com/djmarta_oficial', 'https://open.spotify.com/artist/5K07mHe8Zz8v2fI8Y8vFBa', 1, 4000, 600),
('DJ Pastis', 'David Álvarez', 'Makina', 'Leyenda de la música Mákina y el Hardcore en España, famoso por formar parte del mítico dúo Pastis y Buenri en la sala Pont Aeri.', '1973-11-12', NULL, 'https://instagram.com/djpastisoficial', 'https://open.spotify.com/artist/6S0K61K0A78zQ2X9U8BfBa', 1, 4500, 750),
('Korsakoff', 'Lindsay van der Eng', 'Hardcore', 'Productora y DJ holandesa de Mainstream Hardcore, una de las figuras femeninas más duraderas e importantes del género.', '1983-07-25', NULL, 'https://instagram.com/djkorsakoff', 'https://open.spotify.com/artist/2F07mHe8Zz8v2fI8Y8vFBa', 1, 10000, 310),

-- Pop
('Aitana', 'Aitana Ocaña Morales', 'Pop', 'Cantante y actriz española surgida de OT 2017, consolidada como una de las principales estrellas del pop comercial y de estadios en España.', '1999-06-27', NULL, 'https://instagram.com/aitanax', 'https://open.spotify.com/artist/46ST63S6sYm6pi9g8S6SIs', 1, 120000, 140),
('Rosalía', 'Rosalía Vila Tobella', 'Pop Urbano', 'Cantante y productora de renombre internacional, ganadora del Grammy, conocida por fusionar el flamenco con el pop y ritmos urbanos.', '1992-09-25', NULL, 'https://instagram.com/rosalia.vt', 'https://open.spotify.com/artist/7ltDVj6mZq68UgXNB8gX6Y', 1, 300000, 190),
('Malú', 'María Lucía Sánchez Benítez', 'Pop', 'Consagrada cantante de pop español y balada, con una de las trayectorias vocales y discográficas más sólidas del país.', '1982-03-15', NULL, 'https://instagram.com/_maluoficial_', 'https://open.spotify.com/artist/5r9atgW6gUg4Nb72G8Bfba', 1, 45000, 480),
('Pablo Alborán', 'Pablo Moreno de Alborán Ferrándiz', 'Pop', 'Cantautor de pop y balada romántica, uno de los artistas más vendidos en España desde su debut en el año 2010.', '1989-05-31', NULL, 'https://instagram.com/pabloalboran', 'https://open.spotify.com/artist/1S2S008pSgXgXNB8gX6Yba', 1, 80000, 310),
('India Martínez', 'Jenifer Jessica Martínez Fernández', 'Pop Flamenco', 'Artista cordobesa que fusiona de manera única el pop con raíces profundas del flamenco y la música étnica.', '1985-10-13', NULL, 'https://instagram.com/indiamartinezoficial', 'https://open.spotify.com/artist/6r9atgW6gUg4Nb72G8Bfba', 1, 35000, 260),

-- Reggaeton / Urbano
('Quevedo', 'Pedro Domínguez Quevedo', 'Reggaeton', 'Cantante de música urbana nacido en Madrid y criado en Canarias, alcanzó el número 1 mundial junto a Bizarrap en su sesión 52.', '2001-12-07', NULL, 'https://instagram.com/quevedo.pd', 'https://open.spotify.com/artist/7z97GfbaSgXgXNB8gX6Yba', 1, 150000, 80),
('Rauw Alejandro', 'Raúl Alejandro Ocasio Ruiz', 'Reggaeton', 'Cantante, compositor y gran bailarín puertorriqueño, pionero en la fusión del R&B y el synth-pop con el reggaetón comercial.', '1993-01-10', NULL, 'https://instagram.com/rauwalejandro', 'https://open.spotify.com/artist/1mcTU71T98GfbaSgXgXNB8', 1, 250000, 210),
('Lola Índigo', 'Miriam Doblas Muñoz', 'Pop Urbano', 'Cantante y bailarina española que combina en sus shows intensas coreografías con pop urbano, reggaetón y ritmos electrónicos.', '1992-04-01', NULL, 'https://instagram.com/lolaindigo', 'https://open.spotify.com/artist/5S8yq8YfR1TIsG3V7Mbe7W', 1, 60000, 160),
('Don Omar', 'William Omar Landrón Rivera', 'Reggaeton', 'Considerado unánimemente el "Rey" y uno de los fundadores históricos del movement de reggaetón clásico a nivel mundial.', '1978-02-10', NULL, 'https://instagram.com/donomar', 'https://open.spotify.com/artist/3S8yq8YfR1TIsG3V7Mbe7W', 1, 200000, 450),
('Myke Towers', 'Michael Anthony Torres Monge', 'Reggaeton', 'Rapero y cantante de reggaetón de Puerto Rico, conocido por su potente rapeo, letras explícitas y facilidad para generar hits de radio.', '1994-01-15', NULL, 'https://instagram.com/myketowers', 'https://open.spotify.com/artist/46ST63S6sYm6pi9g8S6SIs', 1, 180000, 230),
('Bad Bunny', 'Benito Antonio Martínez Ocasio', 'Reggaeton', 'Estrella global y máximo exponente del trap latino y el reggaetón, rompiendo récords históricos de reproducciones a nivel mundial.', '1994-03-10', NULL, 'https://instagram.com/badbunnypr', 'https://open.spotify.com/artist/4q3gR6gUg4Nb72G8Bfba', 1, 500000, 310),

-- Rap / Hip-Hop
('Swan Fyahbwoy', 'Elán Swan Fernández', 'Dancehall', 'Conocido como "El Chico de Fuego", es el artista independiente pionero y máximo exponente del Dancehall y Reggae-Rap en España.', '1979-12-14', NULL, 'https://instagram.com/fyahbwoy', 'https://open.spotify.com/artist/0S8yq8YfR1TIsG3V7Mbe7W', 1, 7000, 340),
('Delaossa', 'Daniel Martínez de la Ossa Romero', 'Rap', 'Rapero malagueño del colectivo Space Hammurabi, destacado por sus letras melancólicas, crudas y cargadas de realidad urbana.', '1993-02-11', NULL, 'https://instagram.com/delaossaspace', 'https://open.spotify.com/artist/2G1nNWeuJ2vKzX7987Gfba', 1, 15000, 120),
('SFDK', 'Zatu y Acción Sánchez', 'Rap', 'Mítico dúo sevillano en activo desde los 90, historia viva del hip-hop en castellano y poseedores de récords de aforo en el género.', NULL, NULL, 'https://instagram.com/sfdkoficial', 'https://open.spotify.com/artist/6S8yq8YfR1TIsG3V7Mbe7W', 1, 35000, 850),
('Lia Kali', 'Julia Kali', 'Rap Urbano', 'Artista de Barcelona con una voz rota y un estilo desgarrador que mezcla rap, jazz, soul y música urbana con un mensaje social directo.', '1997-04-15', NULL, 'https://instagram.com/lia.kali', 'https://open.spotify.com/artist/3G1nNWeuJ2vKzX7987Gfba', 1, 8000, 95),
('Violadores del Verso', 'Kase.O, Sho-Hai, Lírico y R de Rumba', 'Rap', 'El grupo de rap más influyente de la historia de España, originarios de Zaragoza y padres del sonido hardcore-rap en castellano.', NULL, NULL, 'https://instagram.com/vicioseoficial', 'https://open.spotify.com/artist/1G1nNWeuJ2vKzX7987Gfba', 0, 50000, 400),
('Sho-Hai', 'Sergio Rodríguez Fernández', 'Rap', 'Componente de Violadores del Verso, alias "El Rey de las Cantinas", maestro del rap sarcástico, crudo, oscuro y pesado de Zaragoza.', '1976-06-19', NULL, 'https://instagram.com/shohai_oficial', 'https://open.spotify.com/artist/5G1nNWeuJ2vKzX7987Gfba', 1, 12000, 310),
('Nach', 'Ignacio Fornés Olmo', 'Rap', 'Uno de los raperos y poetas más respetados de España y Latinoamérica, famoso por la profundidad poética de sus letras y su uso del léxico.', '1974-10-01', NULL, 'https://instagram.com/nachsoyyo', 'https://open.spotify.com/artist/2pAWfr87GfbaSgXgXNB8gX', 1, 22000, 500),
('Rapsusklei', 'Diego Ampudia', 'Rap', 'El "Niño de la Selva", artista zaragozano reconocido por su increíble velocidad al rapear, sus rimas de corte poético y su fuerte influencia reggae.', '1980-03-18', NULL, 'https://instagram.com/rapsuskleioficial', 'https://open.spotify.com/artist/4pAWfr87GfbaSgXgXNB8gX', 1, 9000, 650),
('Sharif', 'Sharif Fernández', 'Rap Poético', 'Rapero de Zaragoza renombrado por su métrica elegante y letras de corte puramente poético y sentimental.', '1980-01-18', NULL, 'https://instagram.com/sharifzgz', 'https://open.spotify.com/artist/6pAWfr87GfbaSgXgXNB8gX', 1, 8500, 310),
('Foyone', 'Pedro Navarro', 'Rap', 'Rapero de Málaga conocido por su universo del "Rap Sin Corte" y sus letras directas cargadas de conspiración, crítica política y realidad social.', '1989-03-07', NULL, 'https://instagram.com/foyone', 'https://open.spotify.com/artist/0G1nNWeuJ2vKzX7987Gfba', 1, 14000, 220),
('Blake', 'Alejandro Cabrera', 'Rap', 'Rapero de Salamanca dotado de un estilo agresivo, letras viscerales cargadas de rabia e introspección y estribillos muy melódicos.', '1991-10-18', NULL, 'https://instagram.com/blakeoficial', 'https://open.spotify.com/artist/7G1nNWeuJ2vKzX7987Gfba', 1, 5500, 140);




INSERT INTO `eventos`
(nombre, descripcion, tipo_evento, fecha_inicio, fecha_fin, precio_base, aforo_total, edad_minima, entradas_disponibles, estado, imagen_url, recinto_id, organizador_id)
VALUES

-- Recinto: Fabrik (Madrid)
('Nexus Festival',
 'El mayor festival de Hardstyle y Hardcore del país con múltiples escenarios simultáneos y los mejores artistas internacionales de la escena hard.',
 'FESTIVAL', '2026-06-13 16:00:00', '2026-06-14 06:00:00', 45.00, 10000, 18, 10000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/v1780334570/Nexus-Madrid-1_eo978g.jpg',1,1),

-- Recinto: Desierto de los Monegros (Huesca)
('Monegros Desert Festival',
 'Experiencia radical de 22 horas de música electrónica ininterrumpida en mitad del desierto, uniendo arquitectura efímera y sonido de vanguardia.',
 'FESTIVAL', '2026-07-25 14:00:00', '2026-07-26 12:00:00', 85.00, 50000, 18, 50000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/v1780336130/monegros-desert_igrqyr.webp',2,1),

-- Recinto: Ciudad Deportiva Guillermo Amor / RBF Benidorm (Alicante)
('Reggaeton Beach Festival Benidorm',
 'El mayor festival playero de música urbana del verano con actuaciones en directo de las estrellas mundiales del reggaetón y atracciones acuáticas.',
 'FESTIVAL', '2026-07-11 12:00:00', '2026-07-12 23:59:00', 70.00, 30000, 16, 30000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/rbf_qigxaj.jpg',10,1),

-- Recinto: Coliseum (Huesca)
('La Romana - Coliseum',
 'La mítica e histórica fiesta anual de la catedral del Hardcore en Aragón. Una noche dedicada al sonido remember, la mákina y el sonido tradicional del club.',
 'SESION', '2026-10-11 23:00:00', '2026-10-12 06:30:00', 20.00, 2500, 18, 2500, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/coli_kp46wz.jpg',8,1),

-- Recinto: Sala Oasis (Zaragoza)
('Lia Kali en Concierto',
 'Presentación íntima en directo de su aclamado álbum. Una noche de rap, soul y tintes de jazz con su desgarradora voz en el corazón de Zaragoza.',
 'CONCIERTO', '2026-11-14 21:00:00', '2026-11-14 23:30:00', 18.00, 900, 16, 900, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/liakali_q91vqg.webp',31,1),

-- Recinto: Espacio Zity (Zaragoza)
('Quevedo - Gira Oficial',
 'El regreso de la estrella urbana a Zaragoza en el marco de las Fiestas del Pilar. Un concierto multitudinario repasando todos sus éxitos mundiales.',
 'CONCIERTO', '2026-10-09 22:00:00', '2026-10-10 00:30:00', 35.00, 25000, 16, 25000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/quevedo_t4b5nz.jpg',30, 1),

-- Recinto: La Riviera (Madrid)
('Delaossa - Tour Madrid',
 'Directo contundente del rapero malagueño presentando sus últimos lanzamientos en la capital, acompañado de artistas invitados de la escena.',
 'CONCIERTO', '2026-11-20 20:30:00', '2026-11-20 23:00:00', 22.00, 2500, 16, 2500, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/delaossa_m3vwwi.png',20,1),

-- Recinto: Recinto Medusa Festival (Valencia)
('Medusa Sunbeach Festival 2026',
 'El mayor festival de música electrónica de la costa este. Tres días de locura con escenarios gigantescos dedicados al hardstyle, techno y remember en primera línea de playa.',
 'FESTIVAL', '2026-08-07 16:00:00', '2026-08-10 06:00:00', 80.00, 60000, 18, 60000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/medusa_xzlurn.jpg',26,1),

-- Recinto: IFEMA Madrid (Madrid)
('Madrid Salvaje 2026',
 'El festival de referencia absoluto para la cultura urbana en la capital. Dos jornadas consecutivas con los mayores exponentes del rap, trap y reggae nacional.',
 'FESTIVAL', '2026-09-25 15:00:00', '2026-09-27 02:00:00', 45.00, 35000, 16, 35000, 'BORRADOR', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/madid_o1yxcm.webp',12,1),

-- Recinto: Fabrik (Madrid)
('CODE - Aniversario Techno',
 'La sesión de techno underground por excelencia de Fabrik. Una maratón de más de 12 horas con los DJs internacionales de techno e industrial más cotizados del planeta repartidos en todas sus áreas.',
 'SESION', '2026-11-14 18:00:00', '2026-11-15 06:00:00', 30.00, 10000, 18, 10000, 'BORRADOR', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/code_m66rys.jpg',1,1),

-- Recinto: Sala López (Zaragoza)
('Sharif - Gira de Salas',
 'El rapero zaragozano vuelve a casa en formato íntimo. Una noche de rimas elegantes, métrica cuidada y pura poesía urbana a orillas del Ebro.',
 'CONCIERTO', '2026-12-04 21:00:00', '2026-12-04 23:30:00', 15.00, 350, 16, 350, 'BORRADOR', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336131/sharif_z9e8ab.png',32,1),

-- Recinto: Sala Apolo (Barcelona)
('Foyone - Presidente Tour',
 'El reptiliano de Málaga aterriza en Barcelona con su rap crudo, directo y sus brutales sesiones "Sin Corte" en vivo sobre el escenario de la emblemática Apolo.',
 'CONCIERTO', '2026-10-23 20:30:00', '2026-10-23 23:00:00', 18.00, 1600, 16, 1600, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/foyone_fseux8.png',21,1),

-- Recinto: INPUT High Fidelity Dance Club (Barcelona)
('Amelie Lens Extended Set',
 'Una experiencia de clubbing exclusiva. La reina del techno belga pincha en un formato íntimo con el sistema de sonido envolvente Funktion-One de INPUT.',
 'SESION', '2026-09-11 23:59:00', '2026-09-12 06:00:00', 25.00, 1000, 18, 1000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/amelie_qgopus.webp',28, 1),

-- Recinto: Estadio Santiago Bernabéu (Madrid)
('Bad Bunny - Most Wanted Tour',
 'El concierto del año en la capital. El icono mundial del reggaetón y trap latino despliega su colosal producción de estadio en el nuevo Bernabéu.',
 'CONCIERTO', '2026-07-18 21:30:00', '2026-07-19 00:30:00', 65.00, 75000, 16, 75000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/badbu_jvflu0.jpg',18,1),

-- Recinto: Spook Multiespacio (Valencia)
('Masters of Hardcore - Valencia Edition',
 'La marca de hardcore más grande del planeta asalta el templo levantino. BPMs al límite, bombos distorsionados y un cartel internacional de infarto.',
 'SESION', '2026-12-05 23:00:00', '2026-12-06 07:00:00', 35.00, 4000, 18, 4000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/mof_riwf2u.webp',9,1),

-- Recinto: WiZink Center (Madrid)
('Aitana - Alpha Tour Arena',
 'La estrella del pop nacional regresa al WiZink Center con su show más electrónico y bailable, repleto de luces, coreografías y hits generacionales.',
 'CONCIERTO', '2026-10-16 21:00:00', '2026-10-16 23:15:00', 40.00, 17453, 14, 17453, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/aitana_fud4mx.jpg',16,1),

-- Recinto: Camping Municipal de Zaragoza (Zaragoza)
('Lagata Reggae Festival 2026',
 'El festival aragonés de cultura jamaicana por excelencia. Tres días de música reggae, rap de corte social, dancehall, talleres y acampada en un entorno natural rodeado de árboles.',
 'FESTIVAL', '2026-06-26 18:00:00', '2026-06-28 20:00:00', 35.00, 3000, 16, 3000, 'PUBLICADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336130/lagata_pcgkil.png',25, 1),

-- Recinto: Multiespacio Rabasa (Alicante)
('Rocanrola Festival 2026',
 'El festival de rap, hip-hop y cultura urbana más grande de España. Dos días de conciertos masivos con las leyendas y los nuevos talentos de la escena nacional reunidos en el levante.',
 'FESTIVAL', '2026-10-09 16:00:00', '2026-10-11 02:00:00', 50.00, 15000, 16, 15000, 'CANCELADO', 'https://res.cloudinary.com/duvblfyfl/image/upload/q_auto/f_auto/v1780336129/rocanrola_jj7naw.jpg', 24,1);



 INSERT INTO `eventos_artistas` (evento_id, artista_id) VALUES
 -- 1. Nexus Festival (Fabrik) -> Miss K8, Angerfist, Sefa, Da Tweekaz, Dr. Peacock
 (1, 1),  -- Miss K8
 (1, 2),  -- Angerfist
 (1, 3),  -- Sefa
 (1, 6),  -- Da Tweekaz
 (1, 7),  -- Dr. Peacock

 -- 2. Monegros Desert Festival -> Amelie Lens, Andrés Campo (u otros techno), Angerfist
 (2, 5),  -- Amelie Lens
 (2, 2),  -- Angerfist

 -- 3. Reggaeton Beach Festival Benidorm -> Quevedo, Rauw Alejandro
 (3, 16), -- Quevedo
 (3, 17), -- Rauw Alejandro

 -- 4. La Romana - Coliseum -> Dany BPM, DJ Marta, DJ Pastis
 (4, 4),  -- Dany BPM
 (4, 8),  -- DJ Marta
 (4, 9),  -- DJ Pastis

 -- 5. Lia Kali en Concierto (Sala Oasis) -> Lia Kali
 (5, 25), -- Lia Kali

 -- 6. Quevedo - Gira Oficial (Espacio Zity) -> Quevedo
 (6, 16), -- Quevedo

 -- 7. Delaossa - Tour Madrid (La Riviera) -> Delaossa
 (7, 23), -- Delaossa

 -- 8. Medusa Sunbeach Festival 2026 -> Amelie Lens, Miss K8, Sefa, Da Tweekaz
 (8, 5),  -- Amelie Lens
 (8, 1),  -- Miss K8
 (8, 3),  -- Sefa
 (8, 6),  -- Da Tweekaz

 -- 9. Madrid Salvaje 2026 (IFEMA) -> SFDK, Delaossa, Foyone, Blake
 (9, 24), -- SFDK
 (9, 23), -- Delaossa
 (9, 31), -- Foyone
 (9, 32), -- Blake

 -- 10. CODE - Aniversario Techno (Fabrik) -> Amelie Lens
 (10, 5), -- Amelie Lens

 -- 11. Sharif - Gira de Salas (Sala López) -> Sharif
 (11, 30), -- Sharif

 -- 12. Foyone - Presidente Tour (Sala Apolo) -> Foyone
 (12, 31), -- Foyone

 -- 13. Amelie Lens Extended Set (INPUT) -> Amelie Lens
 (13, 5), -- Amelie Lens

 -- 14. Bad Bunny - Most Wanted Tour (Bernabéu) -> Bad Bunny
 (14, 21), -- Bad Bunny

 -- 15. Masters of Hardcore - Valencia Edition (Spook) -> Angerfist, Miss K8, Korsakoff
 (15, 2),  -- Angerfist
 (15, 1),  -- Miss K8
 (15, 10), -- Korsakoff

 -- 16. Aitana - Alpha Tour Arena (WiZink Center) -> Aitana
 (16, 11), -- Aitana

 -- 17. Lagata Reggae Festival 2026 -> Swan Fyahbwoy, Rapsusklei
 (17, 22), -- Swan Fyahbwoy
 (17, 29), -- Rapsusklei

 -- 18. Rocanrola Festival 2026 -> Violadores del Verso, SFDK, Nach, Sho-Hai, Rapsusklei
 (18, 26), -- Violadores del Verso
 (18, 24), -- SFDK
 (18, 28), -- Nach
 (18, 27), -- Sho-Hai
 (18, 29)  -- Rapsusklei
;




INSERT INTO `reservas` (fecha_reserva, cantidad_entradas, precio_total, estado, codigo_reserva, usuario_id, evento_id) VALUES
-- Reserva 1: El usuario 'Ana' (ID: 11) compra 3 entradas para el Medusa (Evento ID: 8). Total: 240.00€
('2026-05-15 10:30:00', 3, 240.00, 'CONFIRMADA', 'RES-MED-8492', 11, 8),

-- Reserva 2: El usuario 'Luis' (ID: 12) compra 2 entradas VIP para Lia Kali en la Oasis (Evento ID: 5). Total: 36.00€
('2026-05-20 18:15:00', 2, 36.00, 'PENDIENTE', 'RES-OAS-1104', 12, 5),

-- Reserva 3: El usuario 'María' (ID: 13) intentó comprar 1 entrada para el Monegros (Evento ID: 2) pero canceló el pago. Total: 85.00€
('2026-05-31 11:00:00', 1, 85.00, 'CANCELADA', 'RES-MON-3391', 13, 2);




INSERT INTO `entradas` (codigo_qr, pdf_url, tipo_entrada, precio, estado, fecha_generacion, fecha_uso, reserva_id, evento_id) VALUES
-- Entradas asociadas a la Reserva 1 (Medusa Festival - Reserva ID: 1, Evento ID: 8)
('QR-MED26-A7B8-01', NULL, 'GENERAL', 80.00, 'VALIDA', '2026-05-15 10:31:02', NULL, 1, 8),
('QR-MED26-A7B8-02', NULL, 'GENERAL', 80.00, 'VALIDA', '2026-05-15 10:31:02', NULL, 1, 8),
('QR-MED26-A7B8-03', NULL, 'GENERAL', 80.00, 'VALIDA', '2026-05-15 10:31:02', NULL, 1, 8),

-- Entradas asociadas a la Reserva 2 (Lia Kali en Oasis - Reserva ID: 2, Evento ID: 5)
('QR-OAS26-KALI-01', NULL, 'VIP', 18.00, 'VALIDA', '2026-05-20 18:16:45', NULL, 2, 5),
('QR-OAS26-KALI-02', NULL, 'VIP', 18.00, 'VALIDA', '2026-05-20 18:16:45', NULL, 2, 5),

-- Entrada asociada a la Reserva 3 (Monegros Desert Festival - Reserva ID: 3, Evento ID: 2)
('QR-MON26-FAIL-01', NULL, 'GENERAL', 85.00, 'CANCELADA', '2026-05-31 11:05:10', NULL, 3, 2);