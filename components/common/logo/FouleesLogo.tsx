import Image from "next/image";
import Link from "next/link";

interface FouleesLogoProps {
  size?: number; 
  className?: string; 
}

const FouleesLogo = ({ size, className }: FouleesLogoProps) => {
    return (
        <Link href="/">
            <Image
                width={size} 
                height={size} 
                src="/logo/foulees-logo.png"
                alt="Les Foulées avrillaises logo"
                className={`h-auto w-auto ${className}`}
            />
        </Link>
    );
}

export default FouleesLogo;