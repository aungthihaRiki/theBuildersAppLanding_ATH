import React from "react";
import { brandInfo } from "~/modules/common/data/footerData";
import Image from "next/image";

export function BrandBlock() {
  return (
    <div className="flex flex-col items-start space-y-5">
      <h4 className="text-foreground mb-3 text-lg font-semibold">
        {brandInfo.title}
      </h4>

      <p className="text-foreground max-w-xs text-sm leading-relaxed font-medium">
        {brandInfo.description}
      </p>

      <div className="flex items-center gap-4">
        {brandInfo.partners.map((partner) => (
          <Image
            key={partner.alt}
            src={partner.src}
            alt={partner.alt}
            width={80}
            height={80}
            className="h-6 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}
