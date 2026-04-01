import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FriendLinksPanel } from "@/components/dom/FriendLinksPanel";
import type { FriendLink } from "@/lib/data";

const links: FriendLink[] = [
  {
    name: "Fomalhaut",
    link: "https://fomal.cc/",
    avatar: "https://example.com/fomalhaut.png",
    descr: "我的博客从这里学的",
  },
  {
    name: "Mohao",
    link: "https://blog.mohao.me/",
    avatar: "https://example.com/mohao.png",
    descr: "钟明皓大神",
  },
];

describe("FriendLinksPanel", () => {
  it("renders friend links in a four-column desktop grid", () => {
    const { container } = render(<FriendLinksPanel links={links} />);

    const grid = container.querySelector("#friend-links-container > div");
    const firstLink = screen.getByRole("link", { name: /Fomalhaut/ });
    const secondLink = screen.getByRole("link", { name: /Mohao/ });

    expect(screen.getByRole("heading", { name: "Friend Links" })).toBeVisible();
    expect(firstLink).toBeInTheDocument();
    expect(firstLink).toHaveAttribute("href", "https://fomal.cc/");
    expect(secondLink).toBeInTheDocument();
    expect(secondLink).toHaveAttribute("href", "https://blog.mohao.me/");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });
});
