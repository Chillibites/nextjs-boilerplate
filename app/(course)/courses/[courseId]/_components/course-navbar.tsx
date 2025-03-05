"use client";
import { Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "@/components/homeLayout/toogle-theme";
import { geistMono } from "@/components/fonts";
import { CourseSidebarItem } from "./course-navbar-item";
import { Course, Chapter, UserProgress } from "@prisma/client";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
  hasPurchased: boolean;
}

export const CourseNavbar = ({
  course,
  hasPurchased,
}: CourseNavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-3 md:p-4 bg-card">
      <div className="font-bold text-lg flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="w-9 h-9 mr-2"
        />
        <NavigationMenu className="hidden lg:block mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-card text-base">
                Chapters
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col gap-2">
                {course.chapters.map((chapter) => (
                  <CourseSidebarItem 
                    key={chapter.id} 
                    label={chapter.title}
                    id={chapter.id}
                    courseId={course.id}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    isLocked={!chapter.isFree && !hasPurchased}
                  />
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <h1 className="font-bold truncate text-left text-[hsl(var(--foreground))] px-4 py-2">
        {course.title}
      </h1>

      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open chapters menu"
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary p-4"
          >
            <div>
              <SheetHeader className="mb-4 mx-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo.svg"
                      className="h-7 w-7 mr-2"
                      width={50}
                      height={50}
                      alt="Logo"
                    />
                    <div className={`${geistMono.className} text-xl font-semibold`}>
                      AceAnswer
                    </div>
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">Course Chapters</SheetDescription>
              </SheetHeader>
              <div className="flex-1 w-full overflow-auto">
                {course.chapters.map((chapter) => (
                  <CourseSidebarItem 
                    key={chapter.id} 
                    label={chapter.title}
                    id={chapter.id}
                    courseId={course.id}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    isLocked={!chapter.isFree && !hasPurchased}
                  />
                ))}
              </div>
            </div>
            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <div className="flex gap-2 justify-between w-full">
                <div className="flex items-center">
                  <Link href="/main">
                    <Button variant="default" size="icon" aria-label="Exit">
                      Exit
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center">
                  <ToggleTheme aria-label="Toggle theme" />
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <div className="hidden lg:flex gap-2">
        <Link href="/main">
          <Button variant="default" size="icon">
            Exit
          </Button>
        </Link>
        <ToggleTheme aria-label="Toggle theme" />
      </div>
    </header>
  );
};
