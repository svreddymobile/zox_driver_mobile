import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { filter } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class FooterComponent implements OnInit {

  constructor(public router: Router) {

  }

  ngOnInit() { }

  openPage(type: any) {
    this.router.navigate([type])
  }

  reloadTab(tab: string) {
    const queryParams = { refresh: Date.now() };
    this.router.navigate(['/' + tab], { queryParams });
  }

}
