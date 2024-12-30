import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  imports: [ MatExpansionModule, CommonModule ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  // posts = [
  //   { title: 'First Post', content: 'This is the first posts\'s content' },
  //   { title: 'Second Post', content: 'This is the first posts\'s content' },
  //   { title: 'Third Post', content: 'This is the first posts\'s content '}
  // ];

  @Input() posts: Post[] = [];

}
