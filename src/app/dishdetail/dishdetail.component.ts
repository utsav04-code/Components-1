import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  
  dish: Dish;
  comment: Comment;
  dishIds: string[];
  prev: string;
  next: string;
  
  commentForm: FormGroup;
  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
    
  };

  validationMessages = {
    'author': {
      'required': 'Your name is required',
      'minlength': 'Name should be atleast 2 characters long',
      'maxlength': 'Name should not be more than 25 characters'
    },
    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment should be atleast 2 characters long',
    }


  }
  
  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit() {


    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);

    let id = this.route.params
    .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { 
      this.dish=dish; 
      this.setPrevNext(dish.id); 
    });
  }

  setPrevNext(dishId: string)
  {
    const index= this.dishIds.indexOf(dishId);
    this.prev= this.dishIds[(this.dishIds.length + index - 1)% this.dishIds.length];
    this.next= this.dishIds[(this.dishIds.length + index + 1)% this.dishIds.length];

  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: '',
      comment: ['', [Validators.required, Validators.minLength(2)]],
      date: [this.dt()]
    });
     
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    
  }

  onValueChanged(data?: any)
   {
     if(!this.commentForm) {return;}
     const form= this.commentForm;
     for(const field in this.formErrors) {
       if(this.formErrors.hasOwnProperty(field)) {
         this.formErrors[field]= '';
         const control= form.get(field);
         if(control && control.dirty && !control.valid)
         {
           const messages= this.validationMessages[field];
           for(const key in control.errors)
           {
             if(control.errors.hasOwnProperty(key)) {
               this.formErrors[field] += messages[key] + '';
             }
           }
         }
       }
     }

   }


   onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      author: '',
      rating: '',
      comment: '',
      date: ''
    });
    this.commentFormDirective.resetForm();
  }
   
  dt()
  {
    var d= new Date();
    var n= d.toISOString();
    return n;
  } 
  

  goBack(): void {
    this.location.back();
  }

}
