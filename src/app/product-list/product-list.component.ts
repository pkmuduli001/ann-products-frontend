import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../products.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  isLoggedIn = false;
  userEmail:any='';
  userMessage:string='';

  constructor(private productService: ProductsService, private authService: AuthService) {}

  async ngOnInit() {

     this.userEmail = await this.authService.getUserEmail();

    this.authService.isLoggedIn().then(data=>{
      this.isLoggedIn=data;
    });
    this.productService.getProducts().subscribe({
      next: (data:any) => {
        this.products = data;
        console.log(this.products)
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = '⚠️ Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewDetails(product: Product) {
    alert(`Viewing details for ${product.name}`);
    
  }


   async buyNow(product: Product) {
    
    if (!this.userEmail) {
      alert('Please login to buy products!');
      return;
    }

    await this.productService.notifyPurchase(product.id, product.name, this.userEmail,this.userMessage ).subscribe({
      next: () => alert(`Purchase notification sent for ${product.name}`),
      error: (err) => alert('Error sending notification: ' + err.message)
    });

    await this.productService.sendOrderToSQS(product.id, product.name, this.userEmail,this.userMessage ).subscribe({
      next: () => alert(`Your order : ${product.name}, is in a SQS`),
      error: (err) => alert('Error sending SQS: ' + err.message)
    });
    
    await this.productService.sendOrderDynamo(product.id, product.name, this.userEmail,this.userMessage ).subscribe({
      next: () => alert(`Your order : ${product.name}, is saved in the dynamodb`),
      error: (err) => alert('Error sending to dynamodb: ' + err.message)
    });
  }
}

