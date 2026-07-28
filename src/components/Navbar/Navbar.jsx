"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiInstagram,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import LoginModal from "@/components/LoginModal/LoginModal";
import ProfileModal from "@/components/ProfileModal/ProfileModal";
import MobileBottomNav from "@/components/MobileBottomNav/MobileBottomNav";
import Logo from "@/components/Logo/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getCategories } from "@/services/categoryService";
import { BRAND } from "@/utils/constants";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function displayName(user) {
  const name = user?.name?.trim();
  if (name) return name.split(" ")[0];
  if (user?.phone) return user.phone.slice(-4).padStart(8, "•");
  return "there";
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, logout, user } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCatIds, setOpenCatIds] = useState(() => new Set());
  const userMenuRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((res) => {
        const list = res.data || [];
        setCategories(list);
        // Subcategories stay open by default
        setOpenCatIds(new Set(list.map((c) => c.id)));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchParams.get("signin") === "1" && !isAuthenticated) {
      setLoginOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("signin");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [searchParams, isAuthenticated, pathname, router]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const media = window.matchMedia("(max-width: 860px)");
    if (!media.matches) return undefined;

    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    if (drawerRef.current) drawerRef.current.scrollTop = 0;

    const preventTouchScroll = (e) => {
      if (drawerRef.current?.contains(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventTouchScroll);
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [menuOpen]);

  const headerClass = [styles.header, scrolled ? styles.scrolled : ""]
    .filter(Boolean)
    .join(" ");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const toggleCategory = (id) => {
    setOpenCatIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderLinks = (keyPrefix) =>
    NAV_LINKS.map((link) => {
      if (keyPrefix === "mobile" && link.href === "/shop") {
        return (
          <div key={`${keyPrefix}-shop`} className={styles.shopBlock}>
            <Link href="/shop" className={styles.navLink} onClick={closeMenu}>
              Shop
            </Link>
            <div className={styles.shopTree}>
              {categories.map((cat) => {
                const open = openCatIds.has(cat.id);
                const subs = cat.subcategories || [];
                return (
                  <div key={cat.id} className={styles.catNode}>
                    <div className={styles.catRow}>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className={styles.catLink}
                        onClick={closeMenu}
                      >
                        {cat.name}
                      </Link>
                      <button
                        type="button"
                        className={styles.catToggle}
                        onClick={() => toggleCategory(cat.id)}
                        aria-expanded={open}
                        aria-label={`${open ? "Collapse" : "Expand"} ${cat.name}`}
                      >
                        <FiChevronDown
                          size={18}
                          className={`${styles.catChevron} ${open ? styles.catChevronOpen : ""}`}
                        />
                      </button>
                    </div>
                    {open && subs.length > 0 && (
                      <div className={styles.subList}>
                        {subs.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?subcategory=${sub.slug}`}
                            className={styles.subLink}
                            onClick={closeMenu}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <Link
          key={`${keyPrefix}-${link.href}`}
          href={link.href}
          className={styles.navLink}
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      );
    });

  return (
    <>
      <header className={headerClass}>
        <div className={`container ${styles.inner}`}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link href="/" className={styles.logo}>
            <Logo height={48} className={styles.logoImage} priority />
          </Link>

          <nav className={styles.navDesktop} aria-label="Primary">
            {renderLinks("desktop")}
          </nav>

          <form className={styles.search} onSubmit={handleSearch}>
            <FiSearch className={styles.searchIcon} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here..."
            />
          </form>

          <div className={styles.actions}>
            <Link
              href="/cart"
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              aria-label="Cart"
            >
              <FiShoppingCart size={22} strokeWidth={2.75} />
              {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  type="button"
                  className={styles.profileTrigger}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className={styles.profileAvatar}>
                    {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.profileGreeting}>
                    {displayName(user)}
                  </span>
                  <FiChevronDown
                    className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ""}`}
                    size={16}
                  />
                </button>

                {userMenuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.dropdownName}>
                        {user?.name || `+91 ${user?.phone}`}
                      </span>
                      {user?.phone ? (
                        <span className={styles.dropdownEmail}>
                          +91 {user.phone}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(true);
                        setUserMenuOpen(false);
                      }}
                    >
                      Complete Profile
                    </button>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <button
                      type="button"
                      className={styles.signOutBtn}
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={styles.loginBtn}
                onClick={() => setLoginOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className={styles.navOverlay}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        ref={drawerRef}
        className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Mobile menu"
      >
        <div className={styles.drawerBody}>
          {renderLinks("mobile")}
          <form className={styles.searchMobile} onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here..."
            />
            <button type="submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>
        </div>
        <div className={styles.drawerFooter}>
          <div className={styles.drawerSocial}>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FiInstagram size={18} />
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
          <p className={styles.drawerCopyright}>
            © {new Date().getFullYear()} M Kharavad. All rights reserved.
          </p>
        </div>
      </aside>

      <MobileBottomNav
        onProfileClick={() => {
          closeMenu();
          if (isAuthenticated) {
            setUserMenuOpen((v) => !v);
          } else {
            setLoginOpen(true);
          }
        }}
      />

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}
