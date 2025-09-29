import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  countsObj = {
    assigned: 0,
    upComing: 0,
    completed: 0
  }

  constructor(public router: Router, public api: ApiService) {

    this.loadCounts()
  }



  reloadTab(tab: any) {
    const queryParams = { refresh: Date.now() };
    this.router.navigate(['/trips/' + tab], { queryParams });
  }

  ngOnInit(): void {

  }

  loadCounts() {
    this.api.getCounts({}).subscribe((resp: any) => {
      if (resp) {
        this.countsObj = resp.data;
      }
    })
  }


}
