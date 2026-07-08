import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";
import { cn } from "@/lib/utils";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  const currentPrice = price || 0;

  const discountAmount =
    discount && currentPrice ? (discount * currentPrice) / 100 : 0;

  const grossPrice = currentPrice + discountAmount;

  return (
    <div className="flex flex-col gap-1">
      {/* Gross Price + Discount */}
      {discount && discountAmount > 0 && (
        <div className="flex items-center gap-2">
          <PriceFormatter
            amount={grossPrice}
            className={twMerge(
              "line-through text-sm font-normal text-zinc-500",
              className
            )}
          />

          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
            -{discount}%
          </span>
        </div>
      )}

      {/* Current/Discounted Price */}
      <PriceFormatter
        amount={currentPrice}
        className={cn("text-shop_dark_green font-semibold", className)}
      />
    </div>
  );
};

export default PriceView;