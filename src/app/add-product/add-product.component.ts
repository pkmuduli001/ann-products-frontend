import { Component } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  name: string = '';
  description: string = '';
  price: number | null = null;
  category: string = '';
  stock: number | null = null;
  file: File | null = null;

  message: string = '';
  success: boolean = false;
  loading: boolean = false;   // 👈 NEW

  constructor(private productService: ProductsService) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  async addProduct() {
    this.loading = true;   // show spinner
    this.message = '';
    try {
      let imageUrl: string | null = null;

      if (this.file) {
        const { uploadUrl, objectUrl } = await this.productService.getUploadUrl(
          this.file.name,
          this.file.type
        );
        await this.productService.uploadFileToS3(uploadUrl, this.file);
        imageUrl = objectUrl;
      }

      const result = await this.productService.createProduct({
        name: this.name,
        description: this.description,
        price: this.price!,
        category: this.category,
        stock: this.stock,
        file: imageUrl || null
      });

      this.success = true;
      this.message = result.message || '✅ Product added successfully';
      this.clearForm();
    } catch (err: any) {
      this.success = false;
      this.message = '❌ Error: ' + err.message;
    } finally {
      this.loading = false;   // hide spinner
    }
  }

  clearForm() {
    this.name = '';
    this.description = '';
    this.price = null;
    this.category = '';
    this.stock = null;
    this.file = null;
  }
}
