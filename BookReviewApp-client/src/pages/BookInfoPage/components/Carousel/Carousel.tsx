/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './Carousel.scss';

type Props = {
  coverSrc: string[];
};

export const Carousel = React.memo<Props>(({ coverSrc }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  const showSlides = (numb: number) => {
    let index = slideIndex;
    const slides = document.querySelectorAll<HTMLLIElement>('.carousel__slide');
    const icons = document.querySelectorAll<HTMLLIElement>('.carousel__icon');

    if (numb > slides.length) {
      index = 1;
    }

    if (numb < 1) {
      index = slides.length;
    }

    for (let i = 0; i < slides.length; i += 1) {
      slides[i].style.display = 'none';
    }

    slides[index - 1].style.display = 'block';

    if (icons.length > 1) {
      for (let i = 0; i < icons.length; i += 1) {
        icons[i].classList.remove('carousel__icon--active');
      }

      icons[index - 1].classList.add('carousel__icon--active');
    }

    setSlideIndex(index);
  };

  function handlePrevClick() {
    setSlideIndex(slideIndex - 1);
  }

  function handleNextClick() {
    setSlideIndex(slideIndex + 1);
  }

  function handleCurrentSlide(index: number) {
    setSlideIndex(index);
  }

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  return (
    <div className="carousel">
      <div className="carousel__content">
        <ul className="carousel__slides">
          {coverSrc.map((imageSrc, index) => (
            <li key={imageSrc} className="carousel__slide">
              <img
                src={imageSrc}
                alt="carousel__slide"
                className="carousel__slide-image"
              />

              <div className="carousel__slide-number">
                {index + 1}
                &nbsp;/&nbsp;
                {coverSrc.length}
              </div>
            </li>
          ))}

          <button
            type="button"
            className="carousel__arrow carousel__arrow--prev"
            onClick={handlePrevClick}
          >
            ❮
          </button>

          <button
            type="button"
            className="carousel__arrow carousel__arrow--next"
            onClick={handleNextClick}
          >
            ❯
          </button>
        </ul>

        {coverSrc.length > 1 && (
          <ul className="carousel__icons">
            {coverSrc.map((imageSrc, index) => (
              <li key={imageSrc} className="carousel__icon">
                <img
                  src={imageSrc}
                  alt="carousel__icon"
                  className="carousel__icon-image"
                  onClick={() => handleCurrentSlide(index + 1)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
