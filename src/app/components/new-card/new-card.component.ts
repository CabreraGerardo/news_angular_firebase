import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { INew } from 'src/app/interfaces/new.interface';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {
  @Input() n: INew;
  edit: boolean = false;
  form: FormGroup;
  file: File;  
  img = 'https://e-fisiomedic.com/wp-content/uploads/2013/11/default-placeholder.png';

  constructor(private newService: NewsService,
    private router: Router) { }

  ngOnInit(): void {
    this.file = null;
 
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
  }

  async onUpdate(): Promise<void> {
    try {
      let path = null;
      if (this.file) {
        path = await this.newService.uploadFile(`profile/${this.file.name}`, this.file);
      }
      await this.newService.updateNew(this.n._id, {...this.form.value, image: path ? path : this.img});
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    } finally {
      this.file = null;
    }
  }
  
  async onDelete(id: string){
    this.newService.deleteNewById(id);
  }

  cancelEdit(event){
    this.edit = false;
  }
}
