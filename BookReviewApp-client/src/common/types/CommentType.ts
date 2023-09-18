export interface CommentType {
  id: string;
  bookId: string;
  username: string;
  email: string;
  body: string;
  votes: {
    like: number;
    dislike: number;
  };
}
