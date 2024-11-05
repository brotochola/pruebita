class Obstaculo extends Entidad {
  constructor(obj) {
    super(obj);
    this.radio = obj.radio;

    this.crearGrafico();
  }

  crearGrafico() {
    
    this.grafico = new PIXI.Graphics()
    this.grafico.beginFill(0xff0000)
    this.grafico.drawCircle(0, 0, this.radio)
    
    this.grafico.endFill()
    // this.circuloSeparacionDebug.lineStyle(1,0xaaffaa);


    // this.grafico = new PIXI.Graphics().circle(0, 0, this.radio).fill(0xff0000);
    this.innerContainer.addChild(this.grafico);
  }

  // update() {
  //   // console.log(this.x,this.y)
  //   super.update();
  // }
}
