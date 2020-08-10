import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {SearchService} from './search.service';
import {FormGroup, FormBuilder} from '@angular/forms';


export interface PeriodicElement {
  IntegrationCode: string;
  IntegrationName: string;
  TotalTransactions: number;
  SuccessfulTransactions: number;
  PartialCompleteFailedTransactions: number;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  intName: string;
  sourceId: string;
  intStatus: string;
  fromDate: string;
  toDate: string;
  tableData:boolean = true;

  searchForm: FormGroup;

  displayedColumns: string[] = ['IntegrationCode', 'IntegrationName', 'TotalTransactions', 'SuccessfulTransactions','PartialCompleteFailedTransactions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  data: any = [];

  constructor(private router: Router,
    private http: HttpClient,
    private searchService: SearchService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.paginator);
    console.log(this.dataSource.paginator);
    this.searchForm = this.formBuilder.group({
      intName: [this.intName],
      sourceId: [''],
      intStatus: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

  getSearchRecord() {
    this.tableData = false;
    this.intName= this.searchForm.get('intName').value;
    this.sourceId= this.searchForm.get('sourceId').value;
    this.intStatus= this.searchForm.get('intStatus').value;
    this.fromDate= this.searchForm.get('fromDate').value;
    this.toDate= this.searchForm.get('toDate').value;
    this.searchService.getRecords(this.intName, this.sourceId, this.intStatus, this.fromDate,this.toDate).subscribe((data) => {
      console.log(data.length);
      this.dataSource.data = data; // on data receive populate dataSource.data array
      console.log(this.dataSource.data);
      return data;
   });
 }
}
