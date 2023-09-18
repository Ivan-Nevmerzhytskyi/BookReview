import React from 'react';
import './UserInfo.scss';
import { UserType } from '../../../../common/types/UserType';

type Props = {
  user: UserType;
};

export const UserInfo = React.memo<Props>(({ user }) => {
  const { name, email } = user;

  return (
    <a className="userInfo" href={`mailto:${email}`}>
      {name}
    </a>
  );
});
