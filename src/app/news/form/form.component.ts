import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { IStepChangeEvent, StepState } from '@covalent/core/steps';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { NewsService, INews } from '../services/news.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'qs-news-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class NewsFormComponent implements OnInit {

  title: string;
  email: string;
  id: string;
  by: string;
  description: string;
  newsItem: INews;
  action: string;
  created: Date;
  blockSave: boolean = true;
  state1: StepState = StepState.None;
  state2: StepState = StepState.None;

  @ViewChild('form1') _form1: NgForm;
  @ViewChild('form2') _form2: NgForm;

  constructor(private _newsService: NewsService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _snackBarService: MatSnackBar,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {}

  goBack(): void {
    this._router.navigate(['/news']);
  }

  update(step, isValid): void {
    switch(step) {
      case 1:
        if(isValid) {
          this.state1 = StepState.Complete;
        } else {
          this.state1 = StepState.Required;
        }
        break;
      case 2:
        if(isValid) {
          this.state2 = StepState.Complete;
        } else {
          this.state2 = StepState.Required;
        }
        break;

    }
  }

  ngOnInit(): void {
    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      this.id = params.id;
      if (this.id) {
        this.load();
      }
    });
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('news.form');
      let newsItem: INews = await this._newsService.get(this.id).toPromise();
      this.title = newsItem.title;
      this.by = newsItem.by;
      this.description = newsItem.description;
      this.created = newsItem.created
      this.email = newsItem.email;
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error loading the news'});
    } finally {
      this._loadingService.resolve('news.form');
    }
  }

  change(event: IStepChangeEvent): void {

  }

  async save(): Promise<void> {
    try {
      this._loadingService.register('news.form');
      let now: Date = new Date();
      this.newsItem = {
        title: this.title,
        email: this.email,
        description: this.description,
        id: this.by,
        by: this.by,
        created: now,
      };
      if (this.action === 'add') {
        await this._newsService.create(this.newsItem).toPromise();
      } else {
        await this._newsService.update(this.id, this.newsItem).toPromise();
      }
      this._snackBarService.open('news Saved', 'Ok');
      this.goBack();
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error saving the news item'});
    } finally {
      this._loadingService.resolve('news.form');
    }
  }
}
