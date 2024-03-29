import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { GlobalService } from './services/global.service';
import { ThemesService } from './services/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MemoireMorieroise';
  
  constructor(private authService: AuthService,
              private themesService: ThemesService,
              private globalService: GlobalService) {
                
                this.authService.signInVisiteur().then(() => {
                  this.globalService.ConnecteVisiteur();
                  this.themesService.getThemes();
                });
  }
}
