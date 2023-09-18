export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  booksRating: { bookId: string; rating: string | null }[];
  commentsVote: { commentId: string; vote: string | null }[];
}
