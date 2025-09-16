import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  file?: string;  // image URL
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private API_BASE = 'https://ui5088zvwi.execute-api.us-east-1.amazonaws.com/dev'; 
  // 👆 Replace with your actual Invoke URL


  constructor(private http: HttpClient) {}

  
  // Step 1: Get presigned S3 upload URL
  async getUploadUrl(filename: string, contentType: string) {
    const url = `${this.API_BASE}/presigned-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { uploadUrl, objectUrl }
  }

  // Step 2: Upload file to S3
  async uploadFileToS3(uploadUrl: string, file: File) {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
    return true;
  }

  // Step 3: Save product metadata into DynamoDB
  async createProduct(product: any) {
    console.log(product)
    const res = await fetch(`${this.API_BASE}/add-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_BASE}/products`);
  }

  notifyPurchase(productId: string,productName:string, userEmail: string,userMessage:string): Observable<any> {
    const body = { productId,productName, userEmail,userMessage  };
    return this.http.post(`${this.API_BASE}/notify`, body);
  }
  async deleteProduct(productId: string) {
    const res = await fetch(`${this.API_BASE}/delete-product/${productId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async updateProduct(product: Product) {
    const res = await fetch(`${this.API_BASE}/update-product/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
