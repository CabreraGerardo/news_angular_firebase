import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { INew } from '../interfaces/new.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private news: AngularFirestoreCollection<INew>;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) { 
    this.news = angularFirestore.collection<INew>('news', ref => 
      ref.orderBy('date')
    );
  }

  getAllNews(): Observable<INew[]> {
    return this.news.valueChanges({idField: '_id'});
  }

  getNewsByCategory(category: string): Observable<INew[]> {
    return this.angularFirestore.collection<INew>('news', ref => 
      ref.where('category', '==', category)
    ).valueChanges({idField: '_id'});
  }

  addNew(new_: INew): Promise<DocumentReference<INew>> {
    return this.news.add(new_);
  }

  updateNew(id: string, new_: INew): Promise<void> {
    return this.news.doc(id).update(new_);
  }

  deleteNewById(id: string): Promise<void> {
    return this.news.doc(id).delete();
  }

  async uploadFile(path: string, data: any): Promise<any> {
    await this.angularFireStorage.upload(path, data);
    return await this.angularFireStorage.ref(path).getDownloadURL().toPromise();
  }
}
