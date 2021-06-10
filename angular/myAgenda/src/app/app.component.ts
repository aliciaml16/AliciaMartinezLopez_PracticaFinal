//Importamos las librerías que necesitamos
import { Component } from '@angular/core';

//DECORADOR > asocia el HTML y el CSS con el TS
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'MyAgenda';
}
