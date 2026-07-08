import { Dispatch, SetStateAction } from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  { title: "Dưới 2 triệu", value: "0-2000000" },
  { title: "2 - 5 triệu", value: "2000000-5000000" },
  { title: "5 - 10 triệu", value: "5000000-10000000" },
  { title: "10 - 20 triệu", value: "10000000-20000000" },
  { title: "Trên 20 triệu", value: "20000000-999999999" },
];
interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: Dispatch<SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-base font-semibold text-gray-900">
          Khoảng giá
        </Title>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {priceArray.length}
        </span>
      </div>

      <RadioGroup className="space-y-1" value={selectedPrice || ""}>
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="group flex items-center space-x-3 px-2 py-1 -mx-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="border-gray-300 text-shop_dark_green focus:ring-shop_dark_green"
            />
            <Label
              htmlFor={price.value}
              className={`flex-1 cursor-pointer transition-colors duration-150 ${selectedPrice === price?.value
                ? "font-medium text-shop_dark_green"
                : "text-gray-700 group-hover:text-gray-900"
                }`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPrice && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPrice(null);
          }}
          className="mt-4 text-xs font-medium text-gray-600 hover:text-shop_dark_green underline underline-offset-2 decoration-1 transition-colors duration-150"
        >
          Xóa bộ lọc giá
        </button>
      )}
    </div>
  );
};

export default PriceList;
