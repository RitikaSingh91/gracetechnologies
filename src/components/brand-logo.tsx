import Image from "next/image";

type BrandLogoProps = Readonly<{
  className: string;
}>;

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Image
      alt="Grace Technologies Ltd."
      className={className}
      height={418}
      src="/images/grace-logo.jpeg"
      width={418}
    />
  );
}
