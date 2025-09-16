import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  userEmail:any='';
  message:string='';
  userMessage:string='';
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private authService: AuthService
  ) {}

 async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.userEmail = await this.authService.getUserEmail();
    if (productId) {
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find((p) => p.id === productId) || null;
        console.log(this.product)
        this.loading = false;
      });
    }

    this.authService.isLoggedIn().then(data=>{
      this.isLoggedIn=data;
    });
  }
  async buyNow(product: Product) {
    
    if (!this.userEmail) {
      alert('Please login to buy products!');
      return;
    }

    this.productService.notifyPurchase(product.id, product.name, this.userEmail,this.userMessage ).subscribe({
      next: () => alert(`Purchase notification sent for ${product.name}`),
      error: (err) => alert('Error sending notification: ' + err.message)
    });
    
  }
}
