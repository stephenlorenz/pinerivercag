import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { BannerAlertComponent } from './core/layout/banner-alert/banner-alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, BannerAlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
