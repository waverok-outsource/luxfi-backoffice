import Image from "next/image";
import logoGold from "@/asset/luxfi-gold.png";
import logoWhite from "@/asset/luxfi-white.png";
import logoBlack from "@/asset/luxfi-black.png";
import Link from "next/link";

interface LogoProps {
  variant: "gold" | "white" | "black";
  width?: number;
  height?: number;
  className?: string;
  asLink?: boolean;
}

const Logo = ({ variant = "gold", asLink = false, width = 100, height = 100 }: LogoProps) => {
  const renderedLogo = {
    gold: (
      <Image src={logoGold} alt="Logo" width={width} height={height} className="object-cover" />
    ),
    white: (
      <Image src={logoWhite} alt="Logo" width={width} height={height} className="object-cover" />
    ),
    black: (
      <Image src={logoBlack} alt="Logo" width={width} height={height} className="object-cover" />
    ),
  };

  return asLink ? <Link href="/">{renderedLogo[variant]}</Link> : renderedLogo[variant];
};
export default Logo;
