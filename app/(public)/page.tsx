"use client";

import { useEffect, useState } from "react";
import HomePage from "@/app/(public)/(home)/_layouts/HomePage";
import HomeSkeleton from "./(home)/_components/HomeSkeleton";

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <HomeSkeleton />;
  }

  return <HomePage />;
}
