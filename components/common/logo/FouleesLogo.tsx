import Image from "next/image";
import Link from "next/link";

const FouleesLogo = () => {
    return (
        <Link href="/">
            <Image
                width={"150"}
                height="70"
                src="/logo/foulees-logo.png"
                alt="Les Foulees avrillaises logo"
            />
        </Link>
    );
}

export default FouleesLogo;