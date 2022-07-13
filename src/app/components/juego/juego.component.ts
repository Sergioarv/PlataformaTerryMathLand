import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  gameInstance: any;
  cargando = false;
  progress = 0;

  constructor() { }

  ngOnInit(): void {
    this.cargando = true;
    const loader = (window as any).UnityLoader;
    this.gameInstance = loader.instantiate(
      'unityContainer',
      '/assets/TerryMathLand/Build/TerryMathLand.json', {
        onProgress: (gameInstance: any, progress: number) => {
          this.progress = progress;
          if(progress == 1){
            this.cargando = false;
          }
        }
      }
    );
  }

  setFullscreen(number? : number){
    this.gameInstance.SetFullscreen(1)
  }

  ngOnDestroy(){
    this.gameInstance.Quit();
  }

}
