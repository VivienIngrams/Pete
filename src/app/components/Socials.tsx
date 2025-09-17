import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

interface Social {
    label: string
    Icon: React.ComponentType<{ className: string }>
    href: string
  }
  
const socialLinks: Social[] = [
    {
      label: 'Instagram',
      Icon: FaInstagram,
      href: 'https://www.instagram.com/joel.bardeau.photo',
    },
    {
      label: 'Youtube',
      Icon: FaYoutube,
      href: 'https://www.youtube.com/@TheJbbrava',
    },
    {
      label: 'Facebook',
      Icon: FaFacebook,
      href: 'https://www.facebook.com/joel.bardeau.photo',
    },
  ]
  
  export default function Socials() {
    return (
      <>
        {socialLinks.map(({ label, Icon, href }) => (
          <Link
            aria-label={label}
            className=" rounded-md  transition-all duration-300  sm:-m-3 sm:p-3 hover:text-black"
            href={href}
            key={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="h-5 w-5 align-baseline sm:h-6 sm:w-6" />
          </Link>
        ))}
      </>
    )
  }
  