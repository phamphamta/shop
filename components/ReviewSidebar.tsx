"use client";

import React, { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarIcon, Loader2, Star } from "lucide-react";
import { submitReviewAPI } from "@/lib/reviewAPI";
import { toast } from "sonner";

interface ReviewSidebarProps {
  productId: string;
  productName: string;
  isVerifiedPurchase?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

const ReviewSidebar = React.memo(
  ({
    productId,
    productName,
    isVerifiedPurchase,
    isOpen,
    onClose,
    onReviewSubmitted,
  }: ReviewSidebarProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setContent("");
    }, []);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
          toast.error("Please select a rating");
          return;
        }

        if (title.trim().length < 5) {
          toast.error("Title must be at least 5 characters");
          return;
        }

        if (content.trim().length < 20) {
          toast.error("Review must be at least 20 characters");
          return;
        }

        setIsSubmitting(true);

        try {
          const result = await submitReviewAPI({
            productId,
            rating,
            title: title.trim(),
            content: content.trim(),
          });

          if (result.success) {
            toast.success(result.message);
            resetForm();
            onClose();
            if (onReviewSubmitted) {
              onReviewSubmitted();
            }
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("Failed to submit review. Please try again.");
          console.error("Error submitting review:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [rating, title, content, productId, onClose, onReviewSubmitted, resetForm]
    );

    const handleRatingClick = useCallback((value: number) => {
      setRating(value);
    }, []);

    const handleRatingHover = useCallback((value: number) => {
      setHoverRating(value);
    }, []);

    const handleRatingLeave = useCallback(() => {
      setHoverRating(0);
    }, []);

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!open && !isSubmitting) {
          onClose();
          // Reset form when closing
          setTimeout(resetForm, 300);
        }
      },
      [isSubmitting, onClose, resetForm]
    );

    const titleLength = title.length;
    const contentLength = content.length;
    const isTitleValid = titleLength >= 5;
    const isContentValid = contentLength >= 20;

    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-shop_dark_green">
              <Star className="w-5 h-5" />
              Đánh giá sản phẩm
            </SheetTitle>
            <SheetDescription className="text-left">
              Chia sẻ trải nghiệm của bạn với{" "}
              <span className="font-semibold">{productName}</span>
            </SheetDescription>
            {isVerifiedPurchase && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                <p className="text-sm text-green-700 font-medium">
                  ✓ This will be marked as a verified purchase
                </p>
              </div>
            )}
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-[calc(100vh-180px)] mt-6"
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-4">
              {/* Rating Section */}
              <div className="space-y-3">
                <Label
                  htmlFor="rating"
                  className="text-base font-semibold text-shop_dark_green"
                >
                  Đánh giá của bạn <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => handleRatingHover(value)}
                        onMouseLeave={handleRatingLeave}
                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:ring-offset-2 rounded"
                        aria-label={`Rate ${value} stars`}
                        disabled={isSubmitting}
                      >
                        <StarIcon
                          size={40}
                          className={`${value <= (hoverRating || rating)
                            ? "text-shop_light_green fill-shop_light_green"
                            : "text-gray-300"
                            } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-shop_light_green transition-all duration-300"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-shop_dark_green min-w-[80px]">
                        {rating} {rating === 1 ? "star" : "stars"}
                      </span>
                    </div>
                  )}
                  {rating === 0 && (
                    <p className="text-sm text-gray-500">
                      Click để đánh giá sản phẩm này
                    </p>
                  )}
                </div>
              </div>

              {/* Title Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-base font-semibold text-shop_dark_green"
                >
                  Tiêu đề đánh giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Tóm tắt trải nghiệm của bạn trong vài từ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                  className={`border-gray-300 focus:border-shop_light_green ${titleLength > 0 && !isTitleValid ? "border-red-300" : ""
                    }`}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${titleLength > 0 && !isTitleValid
                      ? "text-red-500"
                      : titleLength >= 5
                        ? "text-green-600"
                        : "text-gray-500"
                      }`}
                  >
                    {titleLength < 5
                      ? `${5 - titleLength} Đánh giá của bạn cần thêm ký tự`
                      : "✓ Tiêu đề đánh giá của bạn đã ổn"
                    }
                  </p>
                  <p className="text-xs text-gray-500">{titleLength}/100</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="content"
                  className="text-base font-semibold text-shop_dark_green"
                >
                  Đánh giá của bạn <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Hãy chia sẻ thêm về trải nghiệm của bạn với sản phẩm này... Bạn thích gì? Điều gì có thể được cải thiện?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  rows={8}
                  required
                  disabled={isSubmitting}
                  className={`border-gray-300 focus:border-shop_light_green resize-none ${contentLength > 0 && !isContentValid ? "border-red-300" : ""
                    }`}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${contentLength > 0 && !isContentValid
                      ? "text-red-500"
                      : contentLength >= 20
                        ? "text-green-600"
                        : "text-gray-500"
                      }`}
                  >
                    {contentLength < 20
                      ? `${20 - contentLength}Đánh giá của bạn cần thêm ký tự`
                      : "✓ Đánh giá của bạn đã đầy đủ"}
                  </p>
                  <p className="text-xs text-gray-500">{contentLength}/1000</p>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2">
                <h4 className="text-sm font-semibold text-blue-900">
                  Hướng dẫn đánh giá
                </h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Hãy trung thực và xây dựng trong phản hồi của bạn</li>
                  <li>Tập trung vào trải nghiệm của bạn với sản phẩm</li>
                  <li>Đánh giá của bạn sẽ được đăng sau khi quản trị viên phê duyệt</li>
                  <li>Hãy tránh ngôn ngữ xúc phạm hoặc tấn công cá nhân</li>
                </ul>
              </div>
            </div>

            {/* Footer with Actions */}
            <SheetFooter className="mt-6 pt-6 border-t flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    rating === 0 ||
                    !isTitleValid ||
                    !isContentValid
                  }
                  className="w-full sm:flex-1 bg-shop_dark_green hover:bg-shop_light_green text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gửi đánh giá...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    );
  }
);

ReviewSidebar.displayName = "ReviewSidebar";

export default ReviewSidebar;
