import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../products.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {

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


  editProduct(product: Product) {
    // 👉 Navigate to edit form (to be implemented)
    alert(`Edit product: ${product.name}`);
  }

  async removeProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await this.productService.deleteProduct(productId);
      this.products = this.products.filter(p => p.id !== productId);
      alert('✅ Product deleted successfully');
    } catch (err: any) {
      alert('❌ Failed to delete product: ' + err.message);
    }
  }
}
