'use client';

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-surface-container-lowest border-t border-outline-variant w-full py-8 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="font-headline-lg text-headline-lg text-primary text-xl font-bold">
          VeritasAI
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 font-label-caps text-label-caps">
          <Link
            href="/limitations"
            className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-opacity duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/limitations"
            className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-opacity duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="/limitations"
            className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-opacity duration-200"
          >
            Ethical AI Charter
          </Link>
          <Link
            href="/evaluation"
            className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-opacity duration-200"
          >
            Evaluation & Post-Mortems
          </Link>
        </div>

        {/* Copyright */}
        <div className="font-label-caps text-label-caps text-on-surface-variant text-center md:text-right">
          © 2024 VeritasAI Admissions Research Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
