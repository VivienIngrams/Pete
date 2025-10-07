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
      href: 'https://www.instagram.com/',
    },
    
    {
      label: 'Facebook',
      Icon: FaFacebook,
      href: 'https://www.facebook.com/',
    },
  ]
  
  export default function Socials() {
    return (
      <div className='flex space-x-1'>
        {socialLinks.map(({ label, Icon, href }) => (
          <Link
            aria-label={label}
            className=" rounded-md  transition-all duration-300  sm:-m-3 sm:p-3 hover:"
            href={href}
            key={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="h-4 w-4 align-baseline sm:h-5 sm:w-5" />
          </Link>
        ))}
      </div>
    )
  }
  