import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  empty_product: Product  = {
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    file: '',  
    createdAt: ''
  };
  product: Product | null = this.empty_product;
  // updatedProduct: Product | null = this.empty_product;
  selectedFile: File | null = null;
  statusMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    // if (productId) {
    //   this.productService.getProducts().subscribe((products) => {
    //     this.product = products.find((p) => p.id === productId)  ;
    //     console.log(this.product)
    //     this.loading = false;
    //   });
    // }

    if (productId) {
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find((p) => p.id === productId) || null;
        console.log(this.product)
        this.loading = false;
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async updateProduct() {
    this.loading = true;
    try {
      let imageUrl = this.product?.file;

      // If new file selected → upload to S3
      if (this.selectedFile) {
        const { uploadUrl, objectUrl } = await this.productService.getUploadUrl(
          this.selectedFile.name,
          this.selectedFile.type
        );

        await this.productService.uploadFileToS3(uploadUrl, this.selectedFile);
        imageUrl = objectUrl;
      }
      if (!this.product?.id) {
        throw new Error('Product ID is missing');
      }
      const updatedProduct = { ...this.product, file: imageUrl};
      await this.productService.updateProduct(updatedProduct);

      console.log(updatedProduct)

      this.statusMessage = '✅ Product updated successfully!';
      setTimeout(() => this.router.navigate(['/admin-dashboard']), 1500);
    } catch (err: any) {
      this.statusMessage = '❌ Update failed: ' + err.message;
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
