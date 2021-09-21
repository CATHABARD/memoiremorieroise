import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { User } from '../../modeles/user';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DroitsFormComponent } from '../droits-form/droits-form.component';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.services';

@Component({
  selector: 'app-droits',
  templateUrl: './droits.component.html',
  styleUrls: ['./droits.component.scss']
})
export class DroitsComponent implements OnInit, OnDestroy {
  user: User | undefined;
  public users: User[] = [];
  public formVisible = false;
  dialogResultSuscription: Subscription | undefined;

  displayedColumns: string[] = ['uid', 'email', 'nom', 'prenom', 'status', 'action'];

  constructor(public globalService: GlobalService,
              private usersService: UsersService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe(us => {
      this.users = us.docs.map(u => {
        const user = u.data() as User;
        user.id = u.id;
        return user;
      },
      (error: any) => {
        console.log(error);
      });
    },
    () => {
    });
  }

  ngOnDestroy() {
    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }
  }

  getDroitsSelectedUser(d: number) {
    let ret = '';

    if (d === 0x10000) {
      return 'Non';
    }

    if (d === 0xFF) {
      return 'Administrateur';
    }

    // tslint:disable-next-line:no-bitwise
    if ((d & 1) === 1) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Visiteur';
    }

   // tslint:disable-next-line:no-bitwise
    if ((d & 2) === 2) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Modérateur';
    }
    // tslint:disable-next-line:no-bitwise
    if ((d & 4) === 4) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Editer articles';
    }

    // tslint:disable-next-line:no-bitwise
    if ((d & 8) === 8) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Editer photos de classes';
    }

    /* if (d === 65536) {
      // tslint:disable-next-line:no-bitwise
      if ((Droits[Droits[i]] & 4) === 4) {
        console.log('i = ' + i);
      }
    }*/
    if (ret === '') {
      ret = 'Non';
    }
    return ret;
  }

  onDroits(row: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    dialogConfig.height = '400px';
    dialogConfig.data = {user: row};

    const dialogRef = this.dialog.open(DroitsFormComponent, dialogConfig);

    this.dialogResultSuscription = dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined ) {
        this.usersService.changeDroitsUser(row.id!, data.status);
      }
    },
    (error) => {
      console.log(error);
    });
  }
}

