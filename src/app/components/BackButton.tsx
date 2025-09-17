import Link from 'next/link';
import { PiArrowBendUpLeftLight } from 'react-icons/pi';

interface BackButtonProps {
  show: boolean;
  href: string;
}

const BackButton = ({ show, href }: BackButtonProps) => {
  if (!show) return null;
  return (
    <Link href={href} className="h-12 absolute top-1 md:top-4 left-2 md:left-5">
      <PiArrowBendUpLeftLight className="text-gray-500 hover:text-black text-2xl md:text-4xl" />
    </Link>
  );
};

export default BackButton;
