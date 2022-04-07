import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Droits } from 'src/app/services/global.service';
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

  displayedColumns: string[] = ['email', 'nom', 'prenom', 'status', 'action'];

  constructor(private usersService: UsersService,
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

    if ((d & Droits.administrateur) === Droits.administrateur) {
      return 'Administrateur';
    }

    // tslint:disable-next-line:no-bitwise
    if ((d & Droits.visiteur) === Droits.visiteur) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Visiteur';
    }

   // tslint:disable-next-line:no-bitwise
    if ((d & Droits.moderateur) === Droits.moderateur) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Modérateur';
    }
    // tslint:disable-next-line:no-bitwise
    if ((d & Droits.editArticle) === Droits.editArticle) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Editer articles';
    }

    // tslint:disable-next-line:no-bitwise
    if ((d & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Editer photos de classes';
    }

    // tslint:disable-next-line:no-bitwise
    if ((d & Droits.editPdf) === Droits.editPdf) {
      if (ret !== '') {
        ret += ', ';
      }
      ret += 'Editer des documents';
    }

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
    dialogConfig.data = row.status;

    const dialogRef = this.dialog.open(DroitsFormComponent, dialogConfig);

    this.dialogResultSuscription = dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined ) {
        this.usersService.changeDroitsUser(row.id as string, data);
      }
    },
    (error) => {
      console.log(error);
    });
  }
}

