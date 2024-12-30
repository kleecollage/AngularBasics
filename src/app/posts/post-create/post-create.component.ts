import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { Post } from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
})

export class PostCreateComponent {
  // newPost = 'NO CONTENT';
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();


  onAddPost() {
    // alert('Post added!');
    // console.dir(postInput);
    // this.newPost = this.enteredValue;
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
}