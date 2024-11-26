import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import Link from "next/link";
import { USER_SHEET_LINKS } from "./constants";
import { Separator } from "../ui/separator";
import Avatar from "../avatar";
import LogoutButton from "../buttons/logout";

const UserSheet = () => {
  const renderSheetLinks = () =>
    USER_SHEET_LINKS.map(({ url, label }) => (
      <Link href={url} key={url}>
        <SheetClose>{label}</SheetClose>
      </Link>
    ));
  return (
    <Sheet>
      <SheetTrigger>
        <Avatar />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between items-center pt-4 pb-10">
              <div className="flex flex-col gap-3 justify-center items-start">
                <div>Account</div>
                <div className="font-extralight">test@test.com</div>
              </div>
              <Avatar className="text-3xl pt-5 pb-5" />
            </div>
          </SheetTitle>
        </SheetHeader>

        <Separator />
        <section className="flex flex-col gap-3 pt-10 text-xl">
          {renderSheetLinks()}
        </section>
        <SheetFooter className="pt-10">
          <LogoutButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
