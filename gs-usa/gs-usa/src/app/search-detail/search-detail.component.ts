import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {SearchDetailService} from './search-detail.service';

export interface PeriodicElement {
  sourceId: string;
  transactionId: string;
  creationDate: number;
  integrationStatus: number;
  errorType: number;
  errorMessage: string;
  payLoad: string;
  action: string;
}

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
  displayedColumns: string[] = ['sourceId', 'transactionId', 'creationDate', 'integrationStatus','errorType', 'errorMessage', 'payLoad', 'action'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  data: any = [];
  constructor(private router: Router,
    private searchDetailService: SearchDetailService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getSearchDetails();
  }

  getSearchDetails() {
    this.searchDetailService.getSearchDetails().subscribe((data) => {
      console.log(data.length);
      this.dataSource.data = data;
      console.log(this.dataSource.data);
      return data;
    })
  }

}
