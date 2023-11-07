import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import './CommentInfo.scss';
import { CommentType } from '../../../../common/types/CommentType';
import { AuthContext } from '../../../../store/AuthContext';
import * as commentService from '../../../../services/commentService';
import * as userService from '../../../../services/userService';
import { Icon } from '../../../../common/components/Icon';
import { Loader } from '../../../../common/components/Loader';
import {
  ErrorNotification,
} from '../../../../common/components/ErrorNotification';

type Props = {
  comment: CommentType;
  onUpdate: (apdatedComment: CommentType) => void;
};

export const CommentInfo = React.memo<Props>(({ comment, onUpdate }) => {
  const {
    id, username, email, body, votes,
  } = comment;

  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [vote, setVote] = useState<string | null>(null);
  const { user, setUser } = useContext(AuthContext);

  // set the user's vote of the comment when the page is loaded
  useEffect(() => {
    const userVote = user?.commentsVote.find(
      (commentVote) => commentVote.commentId === id,
    );

    setVote(userVote ? userVote.vote : null);
  }, [user?.id]);

  const handleCommentVote = (voteType: 'like' | 'dislike') => {
    if (!user) {
      setErrorMessage('Please authorize before voting the book');

      return;
    }

    setUpdating(true);
    setErrorMessage('');

    const commentVote = voteType === vote
      ? { commentId: id, vote: null }
      : { commentId: id, vote: voteType };

    userService
      .updateUserCommentVote(user.id, commentVote)
      .then(setUser)
      .then(() => commentService.updateComment({ id }))
      .then(onUpdate)
      .then(() => {
        if (voteType === vote) {
          setVote(null);
        } else {
          setVote(voteType);
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update comment vote');
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <li className="commentInfo">
      <div className="commentInfo__title">
        <strong className="commentInfo__name">{username}</strong>

        {' by '}

        <a className="commentInfo__email" href={`mailto:${email}`}>
          {email}
        </a>
      </div>

      <div className="commentInfo__body">{body}</div>

      <div className="commentInfo__vote">
        {updating ? (
          <Loader />
        ) : (
          <Icon
            href="#like"
            className={classNames('icon--like', {
              'icon--like-active': vote === 'like',
            })}
            onClick={() => handleCommentVote('like')}
          />
        )}
        {`(${votes.like}) `}
        &nbsp;
        {updating ? (
          <Loader />
        ) : (
          <Icon
            href="#dislike"
            className={classNames('icon--dislike', {
              'icon--dislike-active': vote === 'dislike',
            })}
            onClick={() => handleCommentVote('dislike')}
          />
        )}
        {`(${votes.dislike})`}
      </div>

      {errorMessage && <ErrorNotification message={errorMessage} />}
    </li>
  );
});
