import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { INew } from 'src/app/interfaces/new.interface';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: INew[];
  teachersObs: Subscription;
  
  constructor(private newService: NewsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.news = [];
    

    this.init();
  }

  async init(): Promise<void> {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params)
      if(params.category === "news"){
        this.teachersObs = this.newService.getAllNews().subscribe((news: INew[]) => {
          this.news = news;
          console.log(news);
        });
      }
      else{
        this.teachersObs = this.newService.getNewsByCategory(params.category).subscribe((news: INew[]) => {
          this.news = news;
          console.log(news);
        });
      }
    });
  }

}
