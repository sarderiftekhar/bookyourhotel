"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { User, BookOpen, Heart, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";

interface UserMenuProps {
  variant?: "standalone" | "dropdown";
  onItemClick?: () => void;
}

export default function UserMenu({ variant = "standalone", onItemClick }: UserMenuProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user, profile, loading } = useAuthStore();
  const resetFavorites = useFavoritesStore((s) => s.reset);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (variant === "standalone") {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [variant]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().reset();
    resetFavorites();
    setOpen(false);
    onItemClick?.();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!user) {
    // In dropdown variant, the parent handles the sign-in link
    if (variant === "dropdown") return null;

    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 text-white border border-white/30 hover:bg-white/15 hover:border-white/50"
      >
        {t("signIn")}
      </Link>
    );
  }

  const initials = (profile?.full_name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Dropdown variant: render inline menu items (no popover)
  if (variant === "dropdown") {
    return (
      <>
        {/* User info */}
        <div className="px-4 py-2 mb-1">
          <p className="text-sm font-semibold text-white truncate">
            {profile?.full_name || t("user")}
          </p>
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>

        <Link
          href="/account"
          onClick={onItemClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
        >
          <User size={16} />
          {t("myAccount")}
        </Link>
        <Link
          href="/account/bookings"
          onClick={onItemClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
        >
          <BookOpen size={16} />
          {t("myBookings")}
        </Link>
        <Link
          href="/account/favorites"
          onClick={onItemClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
        >
          <Heart size={16} />
          {t("myFavorites")}
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-full transition-colors w-full cursor-pointer"
        >
          <LogOut size={16} />
          {t("signOut")}
        </button>
      </>
    );
  }

  // Standalone variant: original popover behavior
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-200 hover:bg-white/15 cursor-pointer"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent-bright/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-border mb-1">
            <p className="text-sm font-semibold text-text-primary truncate">
              {profile?.full_name || t("user")}
            </p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>

          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-cream hover:text-accent transition-colors"
          >
            <User size={16} />
            {t("myAccount")}
          </Link>
          <Link
            href="/account/bookings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-cream hover:text-accent transition-colors"
          >
            <BookOpen size={16} />
            {t("myBookings")}
          </Link>
          <Link
            href="/account/favorites"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-cream hover:text-accent transition-colors"
          >
            <Heart size={16} />
            {t("myFavorites")}
          </Link>

          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
            >
              <LogOut size={16} />
              {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
