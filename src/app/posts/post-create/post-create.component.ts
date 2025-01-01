import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
})

export class PostCreateComponent implements OnInit {
  // newPost = 'NO CONTENT';
  // @Output() postCreated = new EventEmitter<Post>();
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // SPINNER
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          // SPINNER
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onSavePost() {
    // alert('Post added!');
    // console.dir(postInput);
    // this.newPost = this.enteredValue;
    if (this.form.invalid) return;

    this.isLoading = true;

    const post: Post = {
      title: this.form.value.title,
      content:  this.form.value.content
    };

    if (this.mode === 'create') {
      // this.postCreated.emit(post);
      this.postService.addPost(post.title, post.content);
    } else {
      this.postService.updatePost(this.postId, post.title, post.content)
    }

    this.form.reset();
  }
}