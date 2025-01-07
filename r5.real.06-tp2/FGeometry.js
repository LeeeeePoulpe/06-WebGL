function getFGeometry() {
  return [
          // face avant : tuile verticale
          -15,   0,  15,
           15,   0,  15,
          -15, 150,  15,
          -15, 150,  15,
           15,   0,  15,
           15, 150,  15,

          // face avant : grande tuile horizontale
           15, 120,  15,
           85, 120,  15,
           15, 150,  15,
           15, 150,  15,
           85, 120,  15,
           85, 150,  15,

          // face avant : petite tuile horizontale
           15,  60,  15,
           52,  60,  15,
           15,  90,  15,
           15,  90,  15,
           52,  60,  15,
           52,  90,  15,

          // face arrière : tuile verticale
          -15,   0, -15,
          -15, 150, -15,
           15,   0, -15,
          -15, 150, -15,
           15, 150, -15,
           15,   0, -15,

          // face arrière : grande tuile horizontale
           15, 120, -15,
           15, 150, -15,
           85, 120, -15,
           15, 150, -15,
           85, 150, -15,
           85, 120, -15,

          // face arrière : petite tuile horizontale
           15,  60, -15,
           15,  90, -15,
           52,  60, -15,
           15,  90, -15,
           52,  90, -15,
           52,  60, -15,

          // face supérieure de la grande barre horizontale
          -15, 150,  15,
           85, 150,  15,
          -15, 150, -15,
          -15, 150, -15,
           85, 150,  15,
           85, 150, -15,

          // extrémité de la grande barre horizontale
           85, 120,  15,
           85, 120, -15,
           85, 150,  15,
           85, 150,  15,
           85, 120, -15,
           85, 150, -15,

          // face inférieure de la grande barre horizontale
           15, 120,  15,
           15, 120, -15,
           85, 120,  15,
           85, 120,  15,
           15, 120, -15,
           85, 120, -15,

          // face séparant les deux barres horizontales
           15,  90,  15,
           15,  90, -15,
           15, 120,  15,
           15, 120,  15,
           15,  90, -15,
           15, 120, -15,

          // face supérieure de la petite barre horizontale
           52,  90,  15,
           52,  90, -15,
           15,  90,  15,
           15,  90,  15,
           52,  90, -15,
           15,  90, -15,

          // extrémité de la petite barre horizontale
           52,  60,  15,
           52,  60, -15,
           52,  90,  15,
           52,  90,  15,
           52,  60, -15,
           52,  90, -15,

          // face inférieure de la petite barre horizontale
           15,  60,  15,
           15,  60, -15,
           52,  60,  15,
           52,  60,  15,
           15,  60, -15,
           52,  60, -15,

          // face latérale sous la petite barre horizontale
           15,   0,  15,
           15,   0, -15,
           15,  60,  15,
           15,  60,  15,
           15,   0, -15,
           15,  60, -15,

          // face inférieure de la barre verticale
          -15,   0,  15,
          -15,   0, -15,
           15,   0,  15,
           15,   0,  15,
          -15,   0, -15,
           15,   0, -15,

          // grande face latérale de la barre verticale
          -15,   0, -15,
          -15,   0,  15,
          -15, 150, -15,
          -15, 150, -15,
          -15,   0,  15,
          -15, 150,  15
        ];
}
