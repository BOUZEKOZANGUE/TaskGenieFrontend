import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TacheService {

 private apiUrl = 'http://localhost:8000/api/taches';  // URL de l'API REST

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Récupérer la liste des tâches depuis l'API REST
  getTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<any[]>('getTaches', []))
      );
  }

  // Ajouter une nouvelle tâche à l'API REST
  ajouterTache(tache: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tache, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('ajouterTache'))
      );
  }

  updateTache(tache: any): Observable<any> {
    const url = `${this.apiUrl}/${tache.id}`;
    return this.http.put<any>(url, tache)
      .pipe(
        tap((response) => {
          catchError(this.handleError<any>('updateTache'));
        }),

      );
  }

  // Supprimer une tâche de l'API REST
  supprimerTache(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('supprimerTache'))
      );
  }

  // Gérer les erreurs de l'API REST
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} a échoué: ${error.message}`);
      return of(result as T);
    };
  }
}
