import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewComponent } from './modules/news/add-new/add-new.component';
import { NewsComponent } from './modules/news/news.component';

const routes: Routes = [
  {path: 'home', children:[
      {path: ':category', component: NewsComponent},
      {path: '**', redirectTo: 'news'}
    ] 
  },
  {path: 'new', component: AddNewComponent },
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
