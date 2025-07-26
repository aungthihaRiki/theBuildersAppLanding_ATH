import Image from "next/image"
import React from "react"
import { headerData } from "~/modules/common/data/headerData"

export function BrandLogo({ className }: { className?: string }) {
  const { src, alt, className: defaultClass, width, height } = headerData.logo

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${defaultClass} ${className ?? ""}`}
    />
  )
}