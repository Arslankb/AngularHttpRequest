import { Products } from './model/products';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {map} from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularHTTPRequest';
  allProducts: Products[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  @ViewChild('productsForm') form: NgForm;


  constructor(private http:HttpClient){

  }

  ngOnInit(){
    this.fetchProducts();
  }

  onProductsFetch(){
    this.fetchProducts();
  }

  // Sending post request to database to send data in a database....
  onProductCreate(products: {pName: string, desc: string, price: string}){
    console.log(products);
    this.http.post<{name: string}>('https://angularhttp-3912c-default-rtdb.firebaseio.com/products.json', products).subscribe((res)=> {
      console.log(res)
    });   
  }

  // Fetching data with Get Request from database....

  private fetchProducts(){
    this.isFetching = true;
    this.http.get<{[key:string]: Products}>('https://angularhttp-3912c-default-rtdb.firebaseio.com/products.json')
    .pipe(map((res)=>{
      const products=[];
      for (const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id:key})
        }
      }
      return products;
    }))
    .subscribe((products)=>{
      console.log(products);
      this.allProducts = products;
      this.isFetching = false;
    })
  }

  onDeleteProduct(id: string){
    this.http.delete('https://angularhttp-3912c-default-rtdb.firebaseio.com/products/' +id+ '.json').subscribe();
  }

  onDeleteAllProduct(){
    this.http.delete('https://angularhttp-3912c-default-rtdb.firebaseio.com/products.json').subscribe();
  }

  onEditClicked(id: string){
    //Get the product based on the id..

    let currentProduct = this.allProducts.find((p) => {return p.id === id});

    //Populate the form with the products details

    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price,
    });

    //Change the button value to update product
    this.editMode = true;
  }
}
