import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactModel } from "../models/contact.model";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  contact: ContactModel;
  contacts: Array<any> = [];
  action: string = 'new';

  errors = [
    "The name must contain more than 3 characters and no numbers",
    "The surname must contain more than 3 characters and no numbers",
    "The age must be a number between 0 and 125",
    "The ID must contain 9 characters",
    "The date must be in ISO8601 format",
    "The color can't contain numbers and it must have more than 3 characters",
    "You have to choose between 'Male, Female, Other, Unspecified'"
  ];

  constructor(private http: HttpClient) {
    this.contact = new ContactModel();
  }

  ngOnInit(): void {
    this.http.get<ContactModel[]>('http://localhost:8800/contacts').subscribe((data: Array<ContactModel>) => {
      this.contacts = data;
    })
  }
  addContact(form: NgForm) {
    //NOMBRE
    if (this.contact.name!.length < 3) {
      this.errors[0] = "The name must contain more than 3 characters and no numbers |";
    } else {
      this.errors[0] = "";
    }
    //APELLIDO
    if (this.contact.surname!.length < 3) {
      this.errors[1] = "The surname must contain more than 3 characters and no numbers |";
    } else {
      this.errors[1] = "";
    }
    //EDAD
    if (this.contact.age! < 0 || this.contact.age! > 125) {
      this.errors[2] = "The age must be a number between 0 and 125 |";
    } else {
      this.errors[2] = "";
    }
    //DNI
    if (this.contact.dni!.length != 9) {
      this.errors[3] = "The ID must contain 9 characters |";
    } else {
      this.errors[3] = "";
    }
    //FECHA
    if (!/^\d{4}$\/\d{1,2}\/\d{1,2}/.test(this.contact.birthday!)) {
      this.errors[4] = "";
    } else {
      this.errors[4] = "The date must be in ISO8601 format";
    }
    //COLOR
    if (this.contact.color!.length < 3 || /\d/.test(this.contact.color!)) {
      this.errors[5] = "The color can't contain numbers and it must have more than 3 characters |";
    } else {
      this.errors[5] = "";
    }
    //SEXO
    if (this.contact.gender! == "Male" || this.contact.gender! == "Female" || this.contact.gender! == "Other" || this.contact.gender! == "Unspecified") {
      this.errors[6] = "";
    } else {
      this.errors[6] = "You have to choose between 'Male, Female, Other, Unspecified' |";
    }

    if (this.errors[0] == "" && this.errors[1] == "" && this.errors[2] == "" && this.errors[3] == "" && this.errors[4] == "" && this.errors[5] == "" && this.errors[6] == "") {
      this.http.post('http://localhost:8800/contact', this.contact).subscribe((res) => {
        this.http.get<ContactModel[]>('http://localhost:8800/contacts').subscribe((data: Array<ContactModel>) => {
          this.contacts = data;
        });
      });

      this.contact.name = "";
      this.contact.surname = "";
      this.contact.age = 0;
      this.contact.dni = "";
      this.contact.birthday = "";
      this.contact.color = "";
      this.contact.gender = "";

      window.alert("Contacto añadido");
    } else {
      window.alert(this.errors[0] + this.errors[1] + this.errors[2] + this.errors[3] + this.errors[4] + this.errors[5] + this.errors[6]);
    }
  }
  deleteContact(id: any) {
    this.http.delete('http://localhost:8800/contact/' + id).subscribe((res) => {
      this.http.get<ContactModel[]>('http://localhost:8800/contacts').subscribe((data: Array<ContactModel>) => {
        this.contacts = data;
      });
    });
  }

  editContact(id: any) {
    this.action = 'update';
    this.http.get<ContactModel>('http://localhost:8800/contact/' + id).subscribe((res: ContactModel) => {
      this.contact = res;
    });
  }

  updateContact(id: any) {//NOMBRE
    if (this.contact.name!.length < 3) {
      this.errors[0] = "The name must contain more than 3 characters and no numbers |";
    } else {
      this.errors[0] = "";
    }
    //APELLIDO
    if (this.contact.surname!.length < 3) {
      this.errors[1] = "The surname must contain more than 3 characters and no numbers |";
    } else {
      this.errors[1] = "";
    }
    //EDAD
    if (this.contact.age! < 0 || this.contact.age! > 125) {
      this.errors[2] = "The age must be a number between 0 and 125 |";
    } else {
      this.errors[2] = "";
    }
    //DNI
    if (this.contact.dni!.length != 9) {
      this.errors[3] = "The ID must contain 9 characters |";
    } else {
      this.errors[3] = "";
    }
    //FECHA
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(this.contact.birthday!)) {
      this.errors[4] = "";
    } else {
      this.errors[4] = "The date must be in ISO8601 format";
    }
    //COLOR
    if (this.contact.color!.length < 3 || /\d/.test(this.contact.color!)) {
      this.errors[5] = "The color can't contain numbers and it must have more than 3 characters |";
    } else {
      this.errors[5] = "";
    }
    //SEXO
    if (this.contact.gender! == "Male" || this.contact.gender! == "Female" || this.contact.gender! == "Other" || this.contact.gender! == "Unspecified") {
      this.errors[6] = "";
    } else {
      this.errors[6] = "You have to choose between 'Male, Female, Other, Unspecified' |";
    }

    if (this.errors[0] == "" && this.errors[1] == "" && this.errors[2] == "" && this.errors[3] == "" && this.errors[4] == "" && this.errors[5] == "" && this.errors[6] == "") {
      this.action = 'new';
      this.http.put('http://localhost:8800/contact/' + this.contact._id, this.contact).subscribe((res) => {
        this.http.get<ContactModel[]>('http://localhost:8800/contacts').subscribe((data: Array<ContactModel>) => {
          this.contacts = data;
        });
      });
      this.contact = new ContactModel();

      this.contact.name = "";
      this.contact.surname = "";
      this.contact.age = 0;
      this.contact.dni = "";
      this.contact.birthday = "";
      this.contact.color = "";
      this.contact.gender = "";

      window.alert("Contacto actualizado");
    } else {
      window.alert(this.errors[0] + this.errors[1] + this.errors[2] + this.errors[3] + this.errors[4] + this.errors[5] + this.errors[6]);
    }
  }
}