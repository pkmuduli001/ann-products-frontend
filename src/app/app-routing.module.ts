import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminGuard } from './admin.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'add-products', component: AddProductComponent, canActivate: [AdminGuard] },
  { path: 'admin-dashboard', component: AdminProductListComponent, canActivate: [AdminGuard] },
  { path: 'orders-list', component: OrderListComponent, canActivate: [AdminGuard] },
  { path: 'product-edit/:id', component: EditProductComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
