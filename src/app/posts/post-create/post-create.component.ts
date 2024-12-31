import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { Post } from "../post.model";
import { PostService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule
  ],
})

export class PostCreateComponent {
  // newPost = 'NO CONTENT';
  enteredTitle = '';
  enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService) {}

  onAddPost(form: NgForm) {
    // alert('Post added!');
    // console.dir(postInput);
    // this.newPost = this.enteredValue;
    if (form.invalid) return;

    const post: Post = {
      id: "ID",
      title: form.value.title,
      content:  form.value.content
    };

    // this.postCreated.emit(post);
    this.postService.addPost(post.title, post.content);
    form.resetForm();
  }
}