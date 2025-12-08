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
                className="w-[75px] h-auto sm:w-[75px] lg:w-[100px]"
            />
        </Link>
    );
}

export default FouleesLogo;