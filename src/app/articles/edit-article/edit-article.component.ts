 import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../modeles/article';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit, OnDestroy {
  public article: Article | undefined;

  constructor(public globalService: GlobalService,
              private articlesService: ArticlesService,
              private route: ActivatedRoute) {
      const id = this.route.snapshot.params.id;
      
      this.articlesService.getArticle(id).subscribe((d: any) => {
        this.article = d.data() as Article;
        this.article.id = d.id;
      },
      (error: any) => {
        console.log('Erreur = ' + error);
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
