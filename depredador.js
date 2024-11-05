class Depredador extends Entidad {
  constructor(obj) {
    super(obj, "metaballs");
    this.lado = 10;
    this.velMax = 5;
    this.accMax = 0.45;
    this.crearGrafico();

    this.factorSeparacion = 25;
    this.factorAlineacion = 141;
    this.factorAgruparse = 20;
    //
    // this.factorEscapar = ESCAPAR_DEFAULT;
    this.factorPerseguir = 10;

    this.vision = VISION_DEFAULT*10;
    this.distanciaLimiteParaEstarCerca = DISTANCIA_SEPARACION_DEFAULT*2;
  }

  crearGrafico() {
    if (!Depredador.textura) {
      Depredador.textura = "loading";
      this.juego.app.loader
        .add("depredador", "img/circulo.png")
        .load((loader, resources) => {
          // Create a sprite from the loaded texture
          // const sprite =
          Depredador.textura = resources.depredador.texture;
        });
    } else {
      if (typeof Depredador.textura == "string") {
        setTimeout(() => this.crearGrafico(), 100);
      } else {
        this.grafico = new PIXI.Sprite(Depredador.textura);
        // this.juego.app.stage.addChild(this.grafico);
        this.grafico.pivot.set(this.grafico.width / 2, this.grafico.height / 2);
        this.grafico.scale.set(0.2);

        this.innerContainer.addChild(this.grafico);
      }
    }

    this.rect = new PIXI.Graphics();
    this.rect.beginFill(0xff0000); // Green color
    this.rect.drawRect(0, 0, this.lado, this.lado / 2);
    this.rect.endFill();

    // this.grafico = new PIXI.Graphics()
    //   .rect(0, 0, this.lado, this.lado / 2)
    //   .fill(0x00ff00);
    // this.grafico.pivot.set(this.grafico.width, this.grafico.height);
    this.innerContainer.addChild(this.rect);
  }

  perseguir(aQuien, serPiolaEIrADondeVaAEstar) {
    if (!aQuien) return;

    //steering = desired_velocity - velocity

    let vectorQApuntaAlTarget = { x: aQuien.x - this.x, y: aQuien.y - this.y };
    if (serPiolaEIrADondeVaAEstar) {
      vectorQApuntaAlTarget.x += target.velocidad.x * 5;
      vectorQApuntaAlTarget.y += target.velocidad.y * 5;
    }

    //NORMALIZAR UN VECTOR ES LLEVAR SU DISTANCIA A 1 (LA DISTANCIA ES LA HIPOTENUSA DEL TRIANGULO RECTANGULO Q SE GENERA ENTRE 0,0 Y EL PUNTO x,y DEL VECTOR)
    let vectorNormalizado = normalizeVector(vectorQApuntaAlTarget);
    //ESTA ES EL VECTOR DE VELOCIDAD AL CUAL QUEREMOS IR PARA LLEGAR AL OBJETIVO
    let velocidadDeseadaNormalizada = {
      x: vectorNormalizado.x * this.factorPerseguir,
      y: vectorNormalizado.y * this.factorPerseguir,
    };

    this.aplicarFuerza(
      velocidadDeseadaNormalizada.x,
      velocidadDeseadaNormalizada.y
    );
  }

  update() {
    if (this.celda && this.meToca()) {
      this.entidadesCerca = this.celda.obtenerEntidadesAcaYEnLasCeldasVecinas();

      if (!this.depredadoresCerca) {
        this.depredadoresCerca = this.buscarDepredadoresCercaUsandoGrid();
      } else if (Math.random() > 0.5) {
        this.depredadoresCerca = this.buscarDepredadoresCercaUsandoGrid();
      }

      this.presasCerca = this.buscarPresasCercaUsandoGrid();

      this.presa = this.buscarPresaMasCercana();

      this.cohesion(this.depredadoresCerca);
      this.separacion(this.depredadoresCerca);
      this.alineacion(this.depredadoresCerca);

      if (this.presa) this.perseguir(this.presa);
    }

    this.obstaculosCercanos = this.obtenerObstaculosCerca();

    this.evadirObstaculos();

    super.update();
  }
}
