import { Component, OnInit } from '@angular/core';
import { Article } from '../../modeles/article';
import { AuthService } from 'src/app/services/auth.service';
import { ThemesService } from 'src/app/services/themes.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  article = new Article('', '', '', this.themesService.currentTheme?.id, new Date().toJSON(), '', '', '', this.authService.getCurrentUser()?.uid, '', 0 );

  constructor(private authService: AuthService,
              private themesService: ThemesService) {

  }

  ngOnInit() {
  }

}
