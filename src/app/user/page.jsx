"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import PestIdentifier from "@/components/page";

export default function HomePage() {
  const [userData, setUserData] = useState({
    name: "Anonymous",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "usersdata", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Menubar className="border-b mb-8 px-6 py-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Link href="/" className="px-4 py-2 hover:bg-accent rounded-md">
                  Home
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Link
                  href="/catalog"
                  className="px-4 py-2 hover:bg-accent rounded-md"
                >
                  Catalog
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{userData.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Menubar>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Rice Pest Identifier And Pest Control Recommender
            </h1>
            <p className="text-muted-foreground text-lg">
              Your one-stop destination for amazing content
            </p>
            <PestIdentifier />
          </section>
        </div>
      </div>
    </>
  );
}
