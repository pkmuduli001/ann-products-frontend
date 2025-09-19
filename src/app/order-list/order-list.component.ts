import { Component, OnInit } from '@angular/core';
import { ProductsService, Product, SQSOrder ,Order} from '../products.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
    products: Product[] = [];
    sqs_orders:SQSOrder[]=[];
    orders:Order[]=[];
    filteredProducts: Product[] = [];
    loading = true;
    error = '';
    searchTerm = '';
    isLoggedIn = false;
    userEmail:any='';
    
    
    constructor(private productService: ProductsService, private authService: AuthService) {}
  
  
  
    async ngOnInit() {
      this.userEmail = await this.authService.getUserEmail();

      this.productService.fetchMessages().subscribe({
        next: (data: any) => {
          console.log(data)
          // store messages in array
          this.sqs_orders = data.messages;

          console.log("Filtered Orders:", this.sqs_orders);
          this.loading = false;
        },
        error: (err: any) => {
          this.error = '⚠️ Error fetching SQS';
          this.loading = false;
          console.error(err);
        }
      });

      this.productService.fetchOrders().subscribe({
        next: (data: any) => {
          
          this.orders=data;
          console.log(this.orders)
          this.loading = false;
        },
        error: (err: any) => {
          this.error = '⚠️ Error fetching';
          this.loading = false;
          console.error(err);
        }
      });
    }

    
  
    async removeOrder(receiptHandle: string) {
      //console.log(receiptHandle)
      if (!confirm('Are you sure you want to approve this order?')) return;
  
      try {
        await this.productService.deleteMessages(receiptHandle);
        this.sqs_orders = this.sqs_orders.filter(p => p.receiptHandle !== receiptHandle);
        alert('✅  Order Approved');
      } catch (err: any) {
        alert('❌ Failed to approved order: ' + err.message);
      }
    }
    approveOrder(order_id:string){

      this.productService.updateStatus(order_id,'done').subscribe({
        next: (data: any) => {
          alert('Order approved successfully!')
        },
        error: (err: any) => {
          alert('Error fetching')
        }
      });
      
    }
    rejectOrder(order_id:string){
      this.productService.updateStatus(order_id,'reject').subscribe({
        next: (data: any) => {
          alert('Order rejected!')
        },
        error: (err: any) => {
          alert('Error fetching')
        }
      });
      
    }
  }


