import { Component, OnInit } from '@angular/core';
import { TacheService } from '../tache.service';
import { NgForm } from '@angular/forms';

class Tache {
  id!: number;
  title!: string;
  description!: string;
  completed!: boolean;
}

@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css']
})
export class TacheComponent implements OnInit {

  taches: Tache[] = [];
  tache: Tache = new Tache();

  constructor(private tacheService: TacheService) { }

  ngOnInit() {
    this.getTaches();
    this.tacheService.getTaches()
    .subscribe((taches) => {
      this.taches = taches;
      // Initialiser la valeur de completed à partir du localStorage
      this.taches.forEach((tache) => {
        const completed = localStorage.getItem(`tache_${tache.id}_completed`);
        if (completed !== null) {
          tache.completed = JSON.parse(completed);
        }
      });
    });
  }

  // Récupère la liste des tâches
  getTaches(): void {
    this.tacheService.getTaches()
      .subscribe(taches => this.taches = taches);
  }

  // Ajoute une nouvelle tâche
  // Soumet le formulaire de tâche
  onSubmit(form: NgForm): void {
    console.log(this.tache);
    this.tacheService.ajouterTache(this.tache)
      .subscribe(() => {
        this.getTaches();
        this.tache = new Tache();
      });
    form.resetForm();
  }

  updateTache(tache: any) {
    // Stocker la valeur de completed actuelle dans le localStorage
    const completed = tache.completed;
    localStorage.setItem(`tache_${tache.id}_completed`, completed);

    // Mettre à jour la tâche dans la base de données
    if (tache.completed) {
      tache.completed = true; // Si la tâche est déjà complétée, la marquer comme non-complétée lors de la mise à jour
    } else {
      tache.completed = false; // Si la tâche n'est pas complétée, la marquer comme complétée lors de la mise à jour
    }

    this.tacheService.updateTache(tache)
      .subscribe((response) => {
        console.log(`Tâche mise à jour: ${JSON.stringify(response)}`);
      }, (error) => {
        // Restaurer la valeur de completed à partir du localStorage si la mise à jour échoue
        tache.completed = completed;
        localStorage.setItem(`tache_${tache.id}_completed`, completed);
      });
  }

  // Supprime une tâche
  supprimerTache(tache: Tache): void {
    this.tacheService.supprimerTache(tache.id)
      .subscribe(() => this.getTaches());
  }
}
