import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, MatButtonModule, CommonModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // HARDCODED DATA
  // posts = [
  //   { title: 'First Post', content: 'This is the first posts\'s content' },
  //   { title: 'Second Post', content: 'This is the first posts\'s content' },
  //   { title: 'Third Post', content: 'This is the first posts\'s content '}
  // ];

  // @Input() posts: Post[] = [];
  isLoading = false;
  posts: Post[] = [];
  private postsSub!: Subscription;


  constructor(public postsService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
