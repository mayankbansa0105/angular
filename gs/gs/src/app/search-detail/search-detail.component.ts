import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SearchDetailService } from './search-detail.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { SearchComponent } from '../search/search.component';
import { SearchService } from '../search/search.service';

export interface PeriodicElement {
  sourceId: string;
  transactionId: string;
  creationDate: number;
  integrationStatus: number;
  errorType: number;
  errorMessage: string;
  payLoad: string;
  action: string;
  pageTitle: string;
}

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
  displayedColumns: string[] = ['SOURCE_TRX_ID', 'TRX_TYPE', 'CREATION_DATE', 'INTEGRATION_STATUS', 'ERROR_TYPE', 'ERROR_MSG', 'PAYLOAD', 'action', 'TARGET_TRX_ID', 'GLOBAL_TRX_ID', 'INT_DTLS_ID', 'SOURCE_SYSTEM', 'TARGET_SYSTEM', 'ERROR_CODE', 'LAST_UPD_USER_ID'];
  dataSource = new MatTableDataSource();
  user;
  test: boolean = true;
  sid: string;
  updateUserInfo: any;
  id: string;
  payLoads: any;
  sourceTrxId: string;
  globaTrxId: string;
  intDetailsId: string;
  resubmitFlag: string = 'Y';
  updatedUserId: string;
  integrationCode: string;
  mysource: any;
  pageTitle: string;
  isLoading: boolean;

  @ViewChild(SearchComponent, { static: true }) childReference;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  data: any = [];
  constructor(private router: Router,
    private searchDetailService: SearchDetailService,
    private searchService: SearchService,
    public dialog: MatDialog,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.test = true;
    console.log(this.searchService.sourceId);
    this.searchService.getNewUserInfo().subscribe(info => {
      this.updateUserInfo = info;
      let source = this.updateUserInfo.sourceId;
      console.log(this.updateUserInfo);
    });

    this.getSearchDetails();
  }

  getSearchDetails() {
    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.searchDetailService.getSearchDetails(this.id, this.updateUserInfo.sourceId, this.updateUserInfo.intStatus, this.updateUserInfo.toDate, this.updateUserInfo.fromDate).subscribe((data) => {
      this.isLoading = false;
      console.log(data.length);
      this.pageTitle = data[0].INTEGRATION_NAME;
      console.log(this.pageTitle);
      if (this.displayedColumns.indexOf('GLOBAL_TRX_ID') === 9) {
        this.displayedColumns.splice(9, 1);
      }
      if (this.displayedColumns.indexOf('TARGET_TRX_ID') === 8) {
        this.displayedColumns.splice(8, 1);
      }

      if (this.displayedColumns.indexOf('INT_DTLS_ID') === 8) {
        console.log(this.displayedColumns.indexOf('INT_DTLS_ID'));
        this.displayedColumns.splice(8, 1);
      }
      if (this.displayedColumns.indexOf('SOURCE_SYSTEM') === 8) {
        console.log(this.displayedColumns.indexOf('SOURCE_SYSTEM'));
        this.displayedColumns.splice(8, 1);
      }
      if (this.displayedColumns.indexOf('TARGET_SYSTEM') === 8) {
        this.displayedColumns.splice(8, 1);
      }
      if (this.displayedColumns.indexOf('ERROR_CODE') === 8) {
        this.displayedColumns.splice(8, 1);
      }
      if (this.displayedColumns.indexOf('LAST_UPD_USER_ID') === 8) {
        this.displayedColumns.splice(8, 1);
      }
      console.log(this.displayedColumns.indexOf('GLOBAL_TRX_ID'));
      this.dataSource.data = data;
      console.log(this.dataSource.data);
      return data;
    })
  }

  columnClick(colName: string) {
    const colIndex = this.displayedColumns.findIndex(col => col === colName);
    console.log(colIndex);

    if (colIndex > 0) {
      // column is currently shown in the table, so we remove it
      this.displayedColumns.splice(colIndex, 1);
    } else {
      // column is not in the table, so we add it
      this.displayedColumns.push(colName);
    }
  }

  editUser(user) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '650px',
      data: user,
      height: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(user);
      this.user = result;
    });
  }

  getRecord(row) {
    console.log(row);
  }

  reProcess(row) {
    console.log(row);
    this.integrationCode = row.INTEGRATION_CODE;
    this.globaTrxId = row.GLOBAL_TRX_ID;
    this.sourceTrxId = row.SOURCE_TRX_ID;
    this.intDetailsId = row.INT_DTLS_ID;
    this.payLoads = row.PAYLOAD;
    this.resubmitFlag = this.resubmitFlag;
    this.updatedUserId = row.LAST_UPD_USER_ID;
    console.log(this.updateUserInfo.sourceId);
    console.log(this.dataSource.data);
    this.searchDetailService.reProcess(this.integrationCode, this.globaTrxId, this.sourceTrxId, this.intDetailsId, this.payLoads, this.resubmitFlag, this.updatedUserId).subscribe((data => {
      console.log(data);
      return data;
    }))
    this.ngOnInit();
  }

}
