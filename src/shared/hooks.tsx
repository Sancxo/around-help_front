import { useState } from "react";

export function useMenu() {
  const [isMenuOpen, toggleMenu] = useState(false);

  return { isMenuOpen, toggleMenu }
}