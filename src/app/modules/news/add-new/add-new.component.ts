import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { INew } from 'src/app/interfaces/new.interface';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {
  @Input() n: INew = null;
  @Output() canceledEdit: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;
  img = 'https://e-fisiomedic.com/wp-content/uploads/2013/11/default-placeholder.png';
  file: File;

  isUpdate: boolean = false;
 
  constructor(
    private newService: NewsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.file = null;

    if(this.n == null)
    {
      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        category: new FormControl('', [Validators.required]),
      });
    }
    else 
    {
      this.form = new FormGroup({
        title: new FormControl(this.n.title, [Validators.required]),
        description: new FormControl(this.n.description, [Validators.required]),
        category: new FormControl(this.n.category, [Validators.required]),
      });
    }
    
    
  }

  async onAdd(): Promise<void> {
    console.log(this.form);
    if (this.form.valid) {
      const firebaseResponse = await this.newService.addNew({ ...this.form.value });
      console.log(firebaseResponse);
      const n = await firebaseResponse.get();
      let path = null;
      if (this.file) {
        path = await this.newService.uploadFile(`profile/${n.id}`, this.file);
        await this.newService.updateNew(n.id, {...n.data(), date: new Date(), image: path ? path : this.img});
      }
      this.file = null;
      path = null;
      this.router.navigate(['/']);
    } else {
      console.log('El formulario es inválido');
    }
  }

  async onUpdate(): Promise<void> {
    try {
      let path = null;
      if (this.file) {
        path = await this.newService.uploadFile(`profile/${this.n._id}`, this.file);
      }
      await this.newService.updateNew(this.n._id, {...this.form.value, image: path ? path : this.n.image});
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    } finally {
      this.file = null;
    }
  }

  /**
  * Método que obtiene un archivo
  * @param event Evento para obtener el archivo seleccionado por el usuario
  */
  async onChange(event: any): Promise<any> {
    const files: any[] = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
      this.img = await this.getBase64(files[0]);
      // const url = await this.userService.uploadFile(`profile/${files[0].name}`, files[0]);
      // this.img = url;
    } else {
      console.log('No selecciono un archivo');
    }
  }

  /**
  * Método que convierte un archivo a base64
  * @param file Archivo
  */
  getBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  cancelEdit(): void{
    this.canceledEdit.emit('cancel');
  }

}
