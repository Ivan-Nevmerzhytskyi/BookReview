import React from 'react';
import './Contacts.scss';
import { Icon } from '../../../../common/components/Icon';

const contactsInfoLinks = [
  {
    title: 'Phone',
    href: 'tel:+380 977-44-37-46',
    target: '_self',
    linkText: '+380 977-44-37-46',
  },
  {
    title: 'Email',
    href: 'mailto:nevmerzhytskyi.ivan@gmail.com',
    target: '_self',
    linkText: 'nevmerzhytskyi.ivan@gmail.com',
  },
  {
    title: 'Address',
    href: 'https://goo.gl/maps/zGRz949BVD2beyJu9',
    target: '_blank',
    linkText: `45 Dombrovsky Street
      code 1029
      Zhytomyr, Ukraine
    `,
  },
];

export const Contacts: React.FC = React.memo(() => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
  };

  return (
    <section className="contacts">
      <h2 className="section-title">Contact us</h2>

      <div className="grid grid--from--tablet">
        <div className="grid__item--tablet-1-3 grid__item--desktop-1-5">
          <form action="/#" method="POST" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              required
              placeholder="Name"
              className="contacts__field form-field"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="contacts__field form-field"
            />

            <textarea
              name="message"
              required
              placeholder="Message"
              className="
                contacts__field
                contacts__field--last
                form-field
                form-field--textarea
              "
            />

            <button className="contacts__button button" type="submit">
              Send
            </button>
          </form>
        </div>

        <div className="grid__item--tablet-4-6 grid__item--desktop-8-12">
          {contactsInfoLinks.map(({
            title, href, target, linkText,
          }) => (
            <div className="contacts__info" key={title}>
              <div className="contacts__info-title">{title}</div>

              <a href={href} target={target} className="contacts__info-link">
                {linkText}
              </a>
            </div>
          ))}

          <div className="contacts__info contacts__info--last">
            <div className="contacts__info-title">Social networks</div>

            <div className="contacts__info-icons">
              <Icon
                href="https://www.facebook.com/"
                target="_blank"
                className="icon--facebook"
              />

              <Icon
                href="https://twitter.com/"
                target="_blank"
                className="icon--twitter"
              />

              <Icon
                href="https://www.instagram.com/"
                target="_blank"
                className="icon--instagram"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
