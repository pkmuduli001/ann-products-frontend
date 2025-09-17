import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
    sqs_orders=[]
    constructor(
      private route: ActivatedRoute,
      private productService: ProductsService,
      private authService: AuthService
    ) {}
  
    async ngOnInit() {
      await this.productService.fetchMessages().subscribe({
      next: (data) => {
        this.sqs_orders=data.messages;
        console.log(data.messages);
        alert('order fetch successfully!')
      },
      error: (err) => alert('Error fetching SQS: ' + err.message)
    });
    }
}
