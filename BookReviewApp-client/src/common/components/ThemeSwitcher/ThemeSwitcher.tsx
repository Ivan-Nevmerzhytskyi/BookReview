import React from 'react';
import './ThemeSwitcher.scss';

export const ThemeSwitcher: React.FC = React.memo(() => {
  const handleClickOnSwitcher = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { currentTarget } = event;
    const page = document.querySelector<HTMLElement>('.page') as HTMLElement;

    if (page.classList.contains('page--theme--dark')) {
      page.classList.remove('page--theme--dark');
      currentTarget.classList.remove('themeSwitcher--theme--dark');
    } else {
      page.classList.add('page--theme--dark');
      currentTarget.classList.add('themeSwitcher--theme--dark');
    }
  };

  return (
    <button
      type="button"
      className="themeSwitcher"
      aria-label="Theme Switcher"
      onClick={handleClickOnSwitcher}
    />
  );
});
