import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./common/Logo";

const NoAccessToCart = ({ details }: { details?: string }) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Chào mừng trở lại!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center font-medium">
            {details
              ? details
              : " Đăng nhập để xem các sản phẩm trong giỏ hàng và thanh toán. Đừng bỏ lỡ các sản phẩm yêu thích của bạn!"}
          </p>
          <SignInButton mode="modal">
            <Button className="w-full font-semibold" size="lg">
              Đăng nhập
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Chưa có tài khoản?
          </div>
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Tạo tài khoản mới
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccessToCart;
