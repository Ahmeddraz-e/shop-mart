import React from "react";
import { ProductI } from "@/interfaces/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Star from "@/components/ui/star";
import AddToCartBtn from "@/components/product/addtocartbtn";

interface ProductCardProps {
  product: ProductI;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-[45vh] w-full bg-transparent flex items-center justify-center">
          <Image
            fill
            src={product.imageCover}
            alt={product.title}
            className="object-cover h-[45vh] w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <CardHeader>
          <h4 className="card-brand text-sm font-semibold text-muted-foreground">
            {product.brand.name}
          </h4>
          <CardTitle
            className="text-xl font-bold line-clamp-1"
            title={product.title}
          >
            {product.title}
          </CardTitle>
          <CardDescription className="text-sm font-semibold text-muted-foreground">
            {product.category.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 mt-auto">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const rating = product.ratingsAverage;
              const fillValue = Math.max(0, Math.min(1, rating - index));
              return (
                <Star
                  key={index}
                  percentage={fillValue * 100}
                  className="text-yellow-500 fill-yellow-400"
                />
              );
            })}
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            ({product.ratingsQuantity} reviews)
          </span>
        </CardContent>
      </Link>
      <AddToCartBtn productId={product._id} price={product.price} />
    </Card>
  );
}
