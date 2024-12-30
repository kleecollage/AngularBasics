import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from "./posts/post-list/post-list.component";
import { Post } from "./posts/post.model";
// import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [PostCreateComponent, HeaderComponent, PostListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular-Basics';
  storedPosts: Post[] = [];

  onPostAdded(post: Post) {
    this.storedPosts.push(post);
  }
}
