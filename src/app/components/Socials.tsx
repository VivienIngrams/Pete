import { FaFacebook, FaInstagram, FaLinkedin, } from 'react-icons/fa';
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
      href: 'https://www.instagram.com/peterlippmann/#',
    },
    
    {
      label: 'LinkedIn',
      Icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/peter-lippmann-48b234108/',
    },
    {
      label: 'Facebook',
      Icon: FaFacebook,
      href: 'https://www.facebook.com/PeterLippmann/',
    },
  ]
  
  export default function Socials() {
    return (
      <div className='flex space-x-6 py-2'>
        {socialLinks.map(({ label, Icon, href }) => (
          <Link
            aria-label={label}
            className=" rounded-md  transition-all duration-300 hover:text-black"
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
  