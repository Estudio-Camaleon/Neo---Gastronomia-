"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useEffect, useRef, startTransition } from "react";
import { useLoading } from "@/core/providers/LoadingProvider";

type TransitionLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    delayMs?: number;
    loadingMessage?: string;
  };

export function TransitionLink({
  href,
  onClick,
  children,
  delayMs = 150,
  loadingMessage,
  className,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { show: showLoading, hide: hideLoading } = useLoading();
  const timeoutRef = useRef<number | null>(null);

  // Normalización estricta de Href (Soporte total para Strings y UrlObjects sin 'any')
  const hrefString = useMemo(() => {
    if (typeof href === "string") return href;

    if (href && typeof href === "object") {
      // 🔒 CONTRATO ESTRICTO: Declaramos los tipos exactos que acepta el ruteador de Next.js
      const urlTarget = href as {
        pathname?: string;
        query?: Record<
          string,
          | string
          | number
          | boolean
          | string[]
          | number[]
          | boolean[]
          | null
          | undefined
        >;
        hash?: string;
      };

      const pathnamePart = urlTarget.pathname || "";
      const hashPart = urlTarget.hash || "";

      // Serialización determinista libre de bugs visuales o de tipado
      let queryPart = "";
      if (urlTarget.query) {
        const params = new URLSearchParams();

        Object.entries(urlTarget.query).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          if (Array.isArray(value)) {
            value.forEach((arrayValue) => {
              if (arrayValue !== undefined && arrayValue !== null) {
                params.append(key, String(arrayValue));
              }
            });
          } else {
            params.set(key, String(value));
          }
        });

        const queryString = params.toString();
        queryPart = queryString ? `?${queryString}` : "";
      }

      return `${pathnamePart}${queryPart}${hashPart}`;
    }
    return "";
  }, [href]);

  const isHashLink = useMemo(() => hrefString.startsWith("#"), [hrefString]);

  const isSamePath = useMemo(() => {
    if (!hrefString.startsWith("/")) return false;
    const targetPath = hrefString.split("#")[0].split("?")[0];
    return targetPath === pathname;
  }, [hrefString, pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => {
        if (!isSamePath && !isHashLink && props.target !== "_blank") {
          router.prefetch(hrefString);
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        if (props.target === "_blank" || isHashLink) {
          return;
        }

        if (isSamePath) {
          return;
        }

        event.preventDefault();
        showLoading(loadingMessage);

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(() => {
          startTransition(() => {
            router.push(hrefString);
            window.requestAnimationFrame(() => {
              hideLoading();
            });
          });
        }, delayMs);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
