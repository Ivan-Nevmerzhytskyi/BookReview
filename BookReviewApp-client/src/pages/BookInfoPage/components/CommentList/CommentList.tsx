import React from 'react';
import './CommentList.scss';
import { CommentType } from '../../../../common/types/CommentType';

import { CommentInfo } from '../CommentInfo';

type Props = {
  comments: CommentType[];
  onUpdate: (apdatedComment: CommentType) => void;
};

export const CommentList = React.memo<Props>(({ comments, onUpdate }) => {
  return (
    <ul className="commentList">
      {comments.map((comment) => (
        <CommentInfo
          key={comment.id}
          comment={comment}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
});
